import React, { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  console.log(orderId)
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await fetch(`${url}/api/order/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId, success }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("✅ Payment verified successfully");
        navigate("/myorders"); // redirect to orders page after success
      } else {
        console.error("❌ Payment verification failed:", result.message);
        navigate("/cart"); // back to cart if failed
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
