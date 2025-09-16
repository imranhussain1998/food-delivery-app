import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets"; // make sure you have a placeholder image here
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}/api/order/list`);
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${url}/api/order/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) fetchOrders();
      else alert("Failed to update order ❌");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2 className="orders-title">Order Page</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* LEFT: Image + Details */}
              <div className="order-left">
                <img
                  src={assets.parcel_icon} 
                  alt="Order"
                  className="order-img"
                />
                <div>
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.name} × {item.quantity}
                        {i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                  <div className="order-address">
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}, {order.address.city}</p>
                    <p>{order.address.state} - {order.address.zipCode}</p>
                    <p>{order.address.country}</p>
                    <p>📞 {order.address.phone}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Meta + Status */}
              <div className="order-right">
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Total:</strong> ₹{order.amount}</p>
                <td>{order.payment ? "✅ Paid" : "❌ Pending"}</td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
