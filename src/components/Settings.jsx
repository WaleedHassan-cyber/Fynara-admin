import React, { useState } from "react";
import Modal from "./Modal.jsx";
import Loader from "./Loader.jsx";

const Settings = () => {
  const URL = import.meta.env.VITE_API_URL;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user:detail");
    return saved ? JSON.parse(saved) : null;
  });

  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImg || "https://via.placeholder.com/150"
  );
  console.log("User data from localStorage:", user);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    if (profileImage) formData.append("image", profileImage);

    try {
      const res = await fetch(`${URL}/api/change-password`, {
        method: "POST",
        body: formData, // No Content-Type header, browser sets it automatically for FormData
        credentials: "include",
      });

      const resData = await res.json();
      if (res.status === 200) {
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        setUser(resData.user);
        setLoader(false);
        setModal(true);
        setTimeout(() => {
          setModal(false);
        }, 5000);
      } else {
        setLoader(false);
        alert(resData.message);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <div className="container" style={{ padding: "2px" }}>
      <div className="settings-content" style={{ padding: "0px 0px" }}>
        <div
          style={{
            border: "1px solid #D1D5DB",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "transparent",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
            Account Settings
          </h2>

          {/* Profile Avatar */}
          <div style={{ textAlign: "start", marginBottom: "35px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={previewImage}
                alt="Profile"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #3B82F6",
                }}
              />
              <label
                htmlFor="profileUpload"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: 0.8,
                }}
              >
                Change Profile
              </label>
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: "#4F46E5",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              Update
            </button>
          </form>
        </div>
      </div>
      {modal && (
        <Modal
          success={true} // true or false
          message="Profile updated"
        />
      )}
      {loader && <Loader />}
    </div>
  );
};

export default Settings;
