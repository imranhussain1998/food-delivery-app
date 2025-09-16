import React, { useState, useEffect } from "react";
import "./List.css";
import { toast } from "react-toastify";

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/food/list");
      if (res.ok) {
        const data = await res.json();
        setList(data.data); // Assuming backend sends { success: true, data: [...] }
      } else {
        console.error("Failed to fetch list");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/food/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ id }),
      }); 
      if (res.ok) {
        toast.success("Item removed successfully");
        fetchList(); // Refresh list after deletion
      } else {
        console.error("Failed to remove item");
      } 
    } catch (error) {
      console.error("Error:", error);
    }
  };



  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`http://localhost:4000/images/` + item.image } alt=""/>
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p className="cursor" onClick={()=>removeItem(item._id)} >X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
