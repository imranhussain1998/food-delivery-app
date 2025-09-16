import { createContext, useEffect, useState } from "react";
import { food_list as staticFoodList } from "../assets/assets"; 
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState(staticFoodList);

  // ✅ Search state
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Add item to cart
  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      fetch(`${url}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      fetch(`${url}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  // ✅ Calculate total price
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await fetch(`${url}/api/food/list`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const mergedList = [
          ...staticFoodList,
          ...data.data.filter(
            (backendItem) =>
              !staticFoodList.some(
                (staticItem) => staticItem._id === backendItem._id
              )
          ),
        ];
        setFoodList(mergedList);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Load cart from backend
  const loadCartData = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.cartItemData);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // ✅ Sync local cart
  const syncLocalCart = async (token) => {
    if (!token) return;
    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];
      for (let i = 0; i < quantity; i++) {
        await fetch(`${url}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId }),
        });
      }
    }
    await loadCartData(token);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
        await syncLocalCart(savedToken);
      }
    }
    loadData();
  }, []);

  // ✅ Filtered list (based on search query)
  const filteredFoodList = food_list.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contextValue = {
    food_list: filteredFoodList,
     // ✅ use this in UI
    searchQuery,
    setSearchQuery,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
