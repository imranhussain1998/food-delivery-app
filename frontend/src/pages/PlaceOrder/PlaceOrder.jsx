import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const onchangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    let orderItems = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((f) => f._id === itemId);
        if (itemInfo) {
          orderItems.push({
            ...itemInfo,
            quantity: cartItems[itemId],
          });
        }
      }
    }

    const orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      address: data,
      email: data.email,
    };

    try {
      const response = await fetch(`${url}/api/order/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.success && result.session_url) {
        window.location.href = result.session_url;
      } else {
        alert("Order failed ❌ " + result.message);
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong ❌");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      {/* LEFT: DELIVERY INFO */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onchangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            onChange={onchangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={onchangeHandler}
          required
        />
        <input
          name="street"
          type="text"
          placeholder="Street"
          value={data.street}
          onChange={onchangeHandler}
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={data.city}
            onChange={onchangeHandler}
            required
          />
          <input
            name="state"
            type="text"
            placeholder="State"
            value={data.state}
            onChange={onchangeHandler}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipCode"
            type="text"
            placeholder="Zip code"
            value={data.zipCode}
            onChange={onchangeHandler}
            required
          />
          <input
            name="country"
            type="text"
            placeholder="Country"
            value={data.country}
            onChange={onchangeHandler}
            required
          />
        </div>
        <input
          name="phone"
          type="tel"
          pattern="[0-9]{10}"
          placeholder="Phone (10 digits)"
          value={data.phone}
          onChange={onchangeHandler}
          required
        />
      </div>

      {/* RIGHT: CART SUMMARY */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details total">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit" className="checkout-btn">
            Proceed to Payment
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
