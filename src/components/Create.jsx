import React, { useState } from "react";
import "../assets/styles/Card.css";
import Modal from "./Modal.jsx";
import Loader from "./Loader.jsx";
const CreateProduct = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [images, setImages] = useState([]);
  const [label, setLabel] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [reviews, setReviews] = useState(0);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [previewImage, setPreviewImage] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0); // default = 0
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loader, setLoader] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Max 4 images allowed.");
      return;
    }

    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setPreviewImage(previews[0] || ""); // Set first image as preview
    setMainImageIndex(0); // default to first
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !category || !price || !desc || images.length === 0) {
      alert("Please fill all fields and upload at least one image.");
      return;
    }
    setLoader(true);
    setIsSubmitting(true); // disable the button

    const formData = new FormData();

    const reorderedImages = [
      images[mainImageIndex],
      ...images.filter((_, i) => i !== mainImageIndex),
    ];

    reorderedImages.forEach((img) => {
      formData.append("images", img);
    });

    formData.append("label", label);
    formData.append("productName", productName);
    formData.append("type", category);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("brand", brand);
    formData.append("reviews", reviews);
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));

    try {
      const res = await fetch(`${API_URL}/api/create`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setLabel("");
        setProductName("");
        setCategory("");
        setPrice("");
        setDesc("");
        setImages([]);
        setPreviewImage("");
        setPreviewImages([]);
        setMainImageIndex(0);
        document.getElementById("imageInput").value = null;
        setLoader(false);
        setSuccessModal(true);
        setLoader(false);
        setTimeout(() => {
          setSuccessModal(false);
        }, 4000); // hide modal after 2 seconds
      }
      console.log(data);
    } catch (error) {
      console.error("Error uploading product:", error);
    } finally {
      setIsSubmitting(false); // enable the button again
    }
  };

  return (
    <div
      style={{
        maxWidth: "95%",
        backgroundColor: "transparent",
        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
        borderRadius: "16px",
        padding: "32px",
      }}
    >
      <h1
        className="text-2xl font-bold text-gray-500"
        style={{ marginBottom: "24px" }}
      >
        Home / <span className="text-[#4F46E5] font-serif">Create Product</span>
      </h1>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* FORM */}
        <form
          style={{
            flex: "2",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
          onSubmit={handleSubmit}
        >
          {/* Product Image */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Upload Images <span className="text-red-600">(Max 4)*</span>
            </label>

            {/* Upload Box Preview */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  style={{
                    width: "80px",
                    height: "80px",
                    border:
                      mainImageIndex === index
                        ? "3px solid #4F46E5"
                        : "2px dashed #ccc",
                    borderRadius: "8px",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: "#888",
                  }}
                >
                  {previewImages[index] ? (
                    <>
                      <img
                        src={previewImages[index]}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => {
                          setMainImageIndex(index);
                          setPreviewImage(previewImages[index]);
                        }}
                        type="button"
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "10px",
                          background: "#4F46E5",
                          color: "#fff",
                          border: "none",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {mainImageIndex === index ? "Main ✓" : "Set as Main"}
                      </button>
                    </>
                  ) : (
                    <span>Empty Slot</span>
                  )}
                </div>
              ))}
            </div>

            {/* File input */}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "block", width: "100%" }}
            />
          </div>

          {/* Label Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Label Name
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="Enter label name"
            />
          </div>

          {/* Product Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="Enter product name"
            />
          </div>

          {/* Product Type */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Product Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              <option value="">Select type</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Beauty">Beauty</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Price (PKR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="e.g. 1500"
            />
          </div>
          {/* Old Price */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Old Price (PKR)
            </label>
            <input
              type="number"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="e.g. 2000"
            />
          </div>

          {/* Brand */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="e.g. Apple, SKMEI..."
            />
          </div>

          {/* Reviews */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Reviews Count
            </label>
            <input
              type="number"
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="e.g. 120"
            />
          </div>

          {/* Colors */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Colors (comma separated)
            </label>
            <input
              type="text"
              value={colors.join(",")}
              onChange={(e) => setColors(e.target.value.split(","))}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="#D12B2B,#222222,#E6C3A5"
            />
          </div>

          {/* Sizes */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Sizes (comma separated)
            </label>
            <input
              type="text"
              value={sizes.join(",")}
              onChange={(e) => setSizes(e.target.value.split(","))}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              placeholder="XS,S,M,L"
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Description
            </label>
            <textarea
              rows={4}
              value={desc}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write about the product..."
            ></textarea>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px 0",
                backgroundColor: isSubmitting ? "#a78bfa" : "#7c3aed",
                color: "#ffffff",
                fontWeight: "600",
                borderRadius: "8px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
          </div>
        </form>

        {/* CARD PREVIEW (Right) */}
        <div style={{ flex: "1" }}>
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              backgroundColor: "#d8e2dc",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
              Product Preview
            </h2>
            <div className="flexbox">
              <div className="product-card">
                <div className="badge">{label || "Label"}</div>
                <div className="product-tumb">
                  {previewImage ? (
                    <img src={previewImage} alt="preview" />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#888",
                        fontSize: "14px",
                      }}
                    >
                      Image Preview
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <span className="product-catagory">
                    {category || "Category"}
                  </span>
                  <h4>
                    <a href="#">{productName || "Product Name"}</a>
                  </h4>
                  <div className="product-bottom-details">
                    <div className="product-price">
                      {price ? (
                        <>
                          <small>{+price + 500}</small>
                          {price}
                        </>
                      ) : (
                        <>
                          <small>0000</small>0000
                        </>
                      )}
                    </div>
                    <div className="product-links">
                      <a href="/">
                        <i className="fa fa-heart"></i>
                      </a>
                      <a href="/">
                        <i className="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {successModal && (
        <Modal
          success={true} // true or false
          message="Product Created"
        />
      )}
      {loader && <Loader />}
    </div>
  );
};

export default CreateProduct;
