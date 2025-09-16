import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./MyOrder.css";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}/api/order/userorders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      } else {
        console.error("Failed to fetch orders:", result.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="myorders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="empty">You have no orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-left">
                <img
                  src={assets.parcel_icon}
                  alt="order"
                  className="order-img"
                />
                <div>
                  <p className="order-items">
                    {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                  </p>
                  <p className="order-meta">
                    Items: {order.items.length}
                  </p>
                </div>
              </div>

              <div className="order-center">
                <p className="order-amount">₹{order.amount}</p>
                <p className={`order-status ${order.status.toLowerCase().replace(" ", "-")}`}>
                  ● {order.status}
                </p>
              </div>

              <div className="order-right">
                <button className="track-btn" onClick={fetchOrders}>Track Order</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
