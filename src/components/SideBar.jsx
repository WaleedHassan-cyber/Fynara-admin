import React, { useState } from "react";
import Logo from "../assets/Shoppii.png";
import Settings from "./Settings.jsx";
import Home from "./Home.jsx";
import Analytics from "./Analytics.jsx";
import Orders from "./Orders.jsx";
import CreateProduct from "./Create.jsx";
import AllProduct from "./AllProduct.jsx";
import History from "./History.jsx";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import Modal from "./Modal.jsx";
const SideBar = () => {
  const [openSide, setOpenSide] = useState(false);
  const [selectedSection, setSelectedSection] = useState("home");
  const [loading, setLoading] = useState(false);
  const { modal, setModal } = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const openBar = () => {
    setOpenSide(true);
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("open");
  };
  const toggleSidebar = () => {
    setOpenSide(!openSide);
    const sidebar = document.querySelector(".sidebar");
    if (openSide) {
      sidebar.classList.remove("open");
    } else {
      sidebar.classList.add("open");
    }
  };
  const handleLogout = () => {
    setLoading(true);
    try {
      const res = fetch(`${API_URL}/api/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 200) {
        setLoading(false);
        console.log("Logged out successfully");
        localStorage.removeItem("user:token");
        localStorage.removeItem("user:detail");
        setModal(true);
        setTimeout(() => {
          setModal(false);
        }, 2000);
        navigate("/");
      } else {
        setLoading(false);
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div className={`sidebar ${openSide ? "open" : ""}`}>
        <div className="logo-details" onClick={toggleSidebar}>
          <div className="logo_name">𝙎𝙝𝙤𝙥𝙥𝙞𝙞</div>
          <i className="bx bx-menu" id="btn" />
        </div>
        <ul className="nav-list">
          <li onClick={openBar}>
            <i className="bx bx-search" />
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>

          <li onClick={() => setSelectedSection("home")}>
            <a href="#!">
              <i className="bx bx-grid-alt" />
              <span className="links_name">Dashboard</span>
            </a>
            <span className="tooltip">Dashboard</span>
          </li>

          <li onClick={() => setSelectedSection("analytics")}>
            <a href="#!">
              <i className="bx bx-pie-chart-alt-2" />
              <span className="links_name">Analytics</span>
            </a>
            <span className="tooltip">Analytics</span>
          </li>

          <li onClick={() => setSelectedSection("files")}>
            <a href="#!">
              <i className="bx bx-folder" />
              <span className="links_name">Files</span>
            </a>
            <span className="tooltip">Files</span>
          </li>

          <li onClick={() => setSelectedSection("order")}>
            <a href="#!">
              <i className="bx bx-cart-alt" />
              <span className="links_name">Order</span>
            </a>
            <span className="tooltip">Order</span>
          </li>

          <li onClick={() => setSelectedSection("saved")}>
            <a href="#!">
              <i className="bx  bxs-t-shirt"></i>
              <span className="links_name">All Product</span>
            </a>
            <span className="tooltip">All Products</span>
          </li>
          <li onClick={() => setSelectedSection("history")}>
            <a href="#!">
              <i className="bx bx-heart" />
              <span className="links_name">Wish List</span>
            </a>
            <span className="tooltip">Wish List</span>
          </li>

          <li onClick={() => setSelectedSection("settings")}>
            <a href="#!">
              <i className="bx bx-cog" />
              <span className="links_name">Settings</span>
            </a>
            <span className="tooltip">Settings</span>
          </li>

          <li className="profile">
            <div className="profile-details">
              <img src={Logo} alt="profileImg" />
              <div className="name_job">
                <div className="name">𝙎𝙝𝙤𝙥𝙥𝙞𝙞</div>
                <div className="job">By Waleed</div>
              </div>
            </div>
            <div className="log_out" onClick={handleLogout}>
              <i className="bx bx-log-out" id="log_out" />
            </div>
          </li>
        </ul>
        {loading && <Loader />}
        {modal && (
          <Modal
            success={true} // true or false
            message="Logout"
          />
        )}
      </div>

      {/* Conditionally rendered sections */}
      <section className="home-section">
        {selectedSection === "home" && (
          <div className="text">
            <Home setSelectedSection={setSelectedSection} />
          </div>
        )}
        {selectedSection === "analytics" && (
          <div className="text">
            <Analytics />
          </div>
        )}
        {selectedSection === "files" && (
          <div className="text">
            <CreateProduct />
          </div>
        )}
        {selectedSection === "order" && (
          <div className="text">
            <Orders />
          </div>
        )}
        {selectedSection === "saved" && (
          <div className="text">
            <AllProduct />
          </div>
        )}
        {selectedSection === "settings" && (
          <div className="text">
            <Settings />
          </div>
        )}
        {selectedSection === "history" && (
          <div className="text">
            <History />
          </div>
        )}
      </section>
    </>
  );
};

export default SideBar;
