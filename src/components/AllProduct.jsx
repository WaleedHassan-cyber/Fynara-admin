import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import Loader from "./Loader.jsx";
// Import the CSS for the loader
const AllProduct = () => {
  const URL = import.meta.env.VITE_API_URL
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [hasChanges, setHasChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await fetch(`${URL}/api/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 200) {
          const data = await res.json();
          setProducts(data);
          setOriginalProducts(data);
        } else {
          console.error("Failed to fetch products: ", res.status);
          alert("Something went wrong while fetching products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products. Please try again later.");
      }
    };

    handleFetch();
  }, [window.location.pathname]);

  useEffect(() => {
    const isChanged = products.some((prod, i) => {
      return (
        prod.price !== originalProducts[i]?.price ||
        prod.inStock !== originalProducts[i]?.inStock
      );
    });
    setHasChanges(isChanged);
  }, [products, originalProducts]);

  //updtae products
  const handleApplyChanges = async () => {
    const changedProducts = products.filter((prod, i) => {
      return (
        prod.price !== originalProducts[i].price ||
        prod.inStock !== originalProducts[i].inStock
      );
    });
    setLoader(true);
    try {
      const res = await fetch(`${URL}/api/update-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: changedProducts }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      } else {
        setLoader(false);
        alert("Changes applied successfully!");
        setOriginalProducts([...products]); // Reset changes
        setHasChanges(false);
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  //fetch all Products

  const handleToggle = (id) => {
    setProducts((prev) =>
      prev.map((prod) =>
        (prod._id || prod.id) === id
          ? { ...prod, inStock: !prod.inStock }
          : prod
      )
    );
  };

  const handlePriceChange = (id, value) => {
    const newPrice = value.replace(/[^0-9]/g, "");
    setProducts((prev) =>
      prev.map((prod) =>
        (prod._id || prod.id) === id ? { ...prod, price: newPrice } : prod
      )
    );
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return; // No product selected for deletion
    setLoader(true);
    try {
      const res = await fetch(
        `${URL}/api/products/${productToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      // Remove product from local state
      const updated = products.filter(
        (prod) => (prod._id || prod.id) !== productToDelete
      );

      setProducts(updated);
      setOriginalProducts(updated);
      setShowModal(false);
      setHasChanges(true);
      setProductToDelete(null); // Reset delete target
      setLoader(false);
      setSuccessModal(true); // Show success modal
      setTimeout(() => {
        setSuccessModal(false); // Hide success modal after 2 seconds
      }, 4000);
    } catch (err) {
      // console.error("Delete failed:", err);
      alert("Something went wrong while deleting the product.");
    }
  };

 const filteredProducts = (filter === "All"
    ? products
    : products.filter((p) => p.type === filter)
  ).filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-w-0 w-full max-w-full overflow-auto bg-transparent rounded-2xl shadow-xl"
      style={{ padding: "32px", marginBottom: "40px" }}
    >
      <div
        className="flex justify-between  items-center"
        style={{ marginBottom: "8px" }}
      >
        <h2
          className="text-3xl font-bold text-[#4f46e5]"
          style={{ marginBottom: "24px" }}
        >
          <span className="text-gray-400 text-[20px]">Home/ </span>All Products
        </h2>
        <div
          className="flex items-center border border-gray-300 rounded-lg  bg-white shadow-sm"
          style={{ padding: "16px 8px" }}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-5 h-5 text-gray-400 ml-2"
            style={{ marginLeft: "8px" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["All", "Clothing", "Electronics"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "6px 16px",
              fontSize: "14px",
              borderRadius: "9999px",
              border: "1px solid #d1d5db",
              backgroundColor: filter === type ? "#4f46e5" : "#fff",
              color: filter === type ? "#fff" : "#374151",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-gray-600 text-sm uppercase tracking-wide">
            <th style={{ padding: "10px" }}>Product</th>
            <th style={{ padding: "10px" }}>Category</th>
            <th style={{ padding: "10px" }}>Selling Price</th>
            <th style={{ padding: "10px" }}>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{ padding: "24px 10px", textAlign: "center" }}
              >
                <span className="text-gray-500 font-medium">
                  No products found in{" "}
                  <span className="font-semibold text-red-600">{filter}</span>
                  category.
                </span>
              </td>
            </tr>
          ) : (
            filteredProducts.map((prod) => (
              <tr
                key={prod._id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition min-h-[80px]"
              >
                <td
                  className="flex items-center gap-3"
                  style={{ padding: "16px 10px" }}
                >
                  <img
                    src={prod.images?.[0]?.url || "/fallback.jpg"}
                    alt={prod.productName}
                    className="w-20 h-20 object-contain"
                    style={{ marginRight: "10px" }}
                  />
                  <span className="text-gray-800 font-medium">
                    {prod.productName}
                  </span>
                </td>
                <td style={{ padding: "16px 10px", verticalAlign: "middle" }}>
                  <span className="text-gray-700">{prod.type}</span>
                </td>
                <td style={{ padding: "16px 10px", verticalAlign: "middle" }}>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={prod.price}
                      disabled={!prod.inStock}
                      onChange={(e) =>
                        handlePriceChange(prod._id, e.target.value)
                      }
                      className={`border rounded-lg px-3 py-1.5 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        prod.inStock
                          ? "bg-white text-gray-900"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      style={{ marginRight: "6px" }}
                    />
                    <span className="text-gray-600">Rs</span>
                  </div>
                </td>
                <td style={{ padding: "16px 10px", verticalAlign: "middle" }}>
                  <div className="flex items-center gap-16">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={prod.inStock}
                        onChange={() => handleToggle(prod._id)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                      <div
                        className={`absolute ml-1 mt-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                          prod.inStock ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </label>

                    {/* ❌ Delete Button with Tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => {
                          setProductToDelete(prod._id);
                          setShowModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ×
                      </button>
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs  rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                        style={{ padding: "4px 8px" }}
                      >
                        Delete
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Apply Changes Button */}
      <div style={{ marginTop: "32px", textAlign: "right" }}>
        <button
          disabled={!hasChanges}
          onClick={handleApplyChanges}
          style={{
            backgroundColor: hasChanges ? "#4f46e5" : "#d1d5db",
            color: hasChanges ? "#fff" : "#9ca3af",
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "8px",
            fontWeight: "500",
            border: "none",
            cursor: hasChanges ? "pointer" : "not-allowed",
            transition: "all 0.2s ease-in-out",
          }}
        >
          Apply Changes
        </button>
      </div>
      {showModal && (
        <Modal onClose={handleClose} onConfirm={handleDelete} text="Delete This Product" />
      )}
      {successModal && (
        <Modal
          success={true} // true or false
          message="Product deleted"
        />
      )}
      {loader && <Loader />}
    </div>
  );
};

export default AllProduct;
