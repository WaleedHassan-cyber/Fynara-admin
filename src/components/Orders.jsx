import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard.jsx";
import Modal from "./Modal.jsx";
const Orders = () => {
  const URL = import.meta.env.VITE_API_URL
  const [progressFilter, setProgressFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 3;
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  //Api call for delete order
  const handleDeleteOrder = async (orderId)=>{
    try {
      const res = await fetch(`http://localhost:5000/api/delete-order/${orderId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const data= await res.json();
      if (!res.ok) {
        console.error("Failed to update status:", data.message);
        return false;
      }
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
      setSuccessModal(true); // Show success modal
      console.log("open");
      setTimeout(() => {
        setSuccessModal(false); // Hide success modal after 2 seconds
        console.log("close");
      }, 4000);
    } catch (error) {
      
    }
  }



 // API call to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${URL}/api/update-status/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update status:", data.message);
        return false;
      }

      // Update order status locally to reflect immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  };

  // API se data fetch
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${URL}/api/orders?page=${currentPage}&limit=${ordersPerPage}`
        );
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const filteredOrders = orders.filter((order) => {
    if (progressFilter === "All") return true;
    return order.status === progressFilter;
  });

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Dynamic pagination buttons logic
  const getPaginationGroup = () => {
    const pages = [];
    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const paginationGroup = getPaginationGroup();

  return (
    <div className="w-[100%]" style={{ padding: "24px" }}>
      <h1 className="text-[24px] font-semibold text-gray-400" style={{ marginBottom: "24px" }}>
        Home / <span className="text-[#4F46E5] font-serif">Orders</span>
      </h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["All", "Order Placed", "Packing", "Shipped", "Delivered", "Cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setProgressFilter(type);
              setCurrentPage(1);
            }}
            style={{
              padding: "6px 16px",
              fontSize: "14px",
              borderRadius: "9999px",
              border: "1px solid #d1d5db",
              backgroundColor: progressFilter === type ? "#4f46e5" : "#fff",
              color: progressFilter === type ? "#fff" : "#374151",
              cursor: "pointer",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px 3px", width: "95%", marginBottom: "24px" }}>
        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <OrderCard
              key={order._id}
              title={order.products?.[0]?.productName || "N/A"}
              name={order.user?.username || "Unknown"}
              address="123 Main St, City, Country"
              phone="1234567890"
              items={order.products?.length || 0}
              paymentMethod="Credit Card"
              paymentStatus={order.status}
              date={new Date(order.createdAt).toLocaleDateString()}
              price={order.totalAmount}
              products={order.products}
              onDelete={()=>handleDeleteOrder(order._id)} 
              progressStatus={order.status}
              onStatusChange={(newStatus) => updateOrderStatus(order._id, newStatus)}
              
            />
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ marginRight: "8px", padding: "6px 12px", cursor: "pointer" }}
        >
          Previous
        </button>

        {paginationGroup.map((item, index) =>
          item === "..." ? (
            <span key={index} style={{ margin: "0 6px" }}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(item)}
              style={{
                marginRight: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: currentPage === item ? "bold" : "normal",
                backgroundColor: currentPage === item ? "#4f46e5" : "#fff",
                color: currentPage === item ? "#fff" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>
      {successModal && (
        <Modal
          success={true} // true or false
          message="Product deleted"
        />
      )}
    </div>
  );
};

export default Orders;
