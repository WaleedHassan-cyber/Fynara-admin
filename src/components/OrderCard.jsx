import React, { useState } from "react";
import "../assets/animation/fadeIn.css"; // Importing fade-in animation styles
import DelBtn from "./DelBtn.jsx";
import Modal from "./Modal.jsx";
const OrderCard = ({
  title,
  name,
  address,
  phone,
  items,
  paymentMethod,
  paymentStatus,
  date,
  price,
  products,
  progressStatus,
  onStatusChange,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  
  const options = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    // console.log("open modal");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(); // backend se order delete
      setShowModal(false);
      
    } catch (error) {
      console.error(error);
      alert("Failed to delete order.");
    }
  };

  return (
    <div
      className="bg-[#3b4a5a] text-white rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center w-full"
      style={{ padding: "16px", marginBottom: "16px" }}
    >
      <div className="flex gap-4 w-full">
        {/* Logo */}
        <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center">
          <img
            src={products[0]?.images || "https://via.placeholder.com/150"}
            alt="logo"
            className="w-8 h-8"
          />
        </div>

        {/* Order Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-100">{title}</h3>
          <p className="text-sm text-gray-300">{name}</p>
          <p className="text-sm text-gray-300">{address}</p>
          <p className="text-sm text-gray-300">{phone}</p>
          <h3 className="text-sm font-semibold text-blue-100">
            Products Ordered:
          </h3>
          <ul>
            {products.map((item) => (
              <li key={item.productId}>
                <p className="text-sm text-gray-300">
                  {item.productName} - Quantity: {item.quantity} - Price: $
                  {item.price} - Size: {item.selectedSize} - Color: {item.selectedColor}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Order Info */}
        <div
          className="flex-2 min-w-[140px] sm:mt-0"
          style={{ marginTop: "8px" }}
        >
          <p className="text-sm text-gray-300">Items: {items}</p>
          <p className="text-sm text-gray-300">Method: {paymentMethod}</p>
          <p className="text-sm text-gray-300">Payment: {paymentStatus}</p>
          <p className="text-sm text-gray-300">Date: {date}</p>
          <p className="text-lg font-bold mt-1">₹ {price}</p>
        </div>

        {/* Dropdown */}
        <div className="sm:mt-0" style={{ marginTop: "8px" }}>
          <div className="relative inline-block text-left">
            <button
              onClick={() => setOpen(!open)}
              className="relative group border-none bg-transparent outline-none cursor-pointer font-mono font-light uppercase text-base"
              style={{ padding: "0" }}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px" />
              <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]" />
              <div
                className="relative flex items-center justify-between text-lg text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110"
                style={{ padding: "12px 24px" }}
              >
                <span className="select-none">{progressStatus}</span>
              </div>
            </button>
            <div
              className="absolute right-0 top-full "
              style={{ marginTop: "25px" }}
            >
              <DelBtn onClick={handleDeleteClick} />
            </div>

            {open && (
              <div
                className="absolute right-0 w-48 bg-gray-500 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in"
                style={{ marginTop: "8px" }}
              >
                <ul className="" style={{ padding: "8px" }}>
                  {options.map((opt) => {
                    const dotColorMap = {
                      "Order Placed": "bg-blue-400",
                      Packing: "bg-yellow-400",
                      Shipped: "bg-purple-400",
                      Delivered: "bg-green-500",
                      Cancelled: "bg-red-500",
                    };

                    return (
                      <li key={opt}>
                        <button
                          onClick={() => {
                            onStatusChange(opt);
                            setOpen(false);
                          }}
                          className="w-full flex items-center gap-2 text-sm text-white hover:bg-gray-800 hover:rounded-xl hover:text-white transition-all duration-200 font-medium tracking-wide"
                          style={{ padding: "20px 8px" }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${dotColorMap[opt]}`}
                          ></span>
                          <span>{opt}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={handleClose}
          onConfirm={handleConfirmDelete}
          text="Order"
        />
      )}
      
    </div>
  );
};

export default OrderCard;
