import React from "react";
import { useState, useEffect } from "react";
import {
  TagIcon,
  ShoppingCart,
  Users,
  KeyRoundIcon,
  Settings,
  LogOut,
} from "lucide-react";
import Loader from "./Loader.jsx"

const Home = ({ setSelectedSection }) => {
  const URL = import.meta.env.VITE_API_URL
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalProduct, setTotalProduct] = useState("0");
  const [totalOrder, setTotalOrder] = useState("0");
  const [totalUser, setTotalUser] = useState("0");
  const [loader, setLoader] = useState(false);
const [user, setUser] = useState(JSON.parse(localStorage.getItem("user:detail")));
  useEffect(() => {
    setLoader(true);
    try {
      const fetchData = async () => {
        const response = await fetch(
          `${URL}/api/get-total-documents`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTotalProduct(data.totalProducts);
          setTotalOrder(data.totalOrders);
          setTotalUser(data.totalCustomers);
          setLoader(false);
        } else {
          setLoader(false);
          console.error("Error fetching data:", data.message);
        }
      };
      fetchData();
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <div
      className="bg-transparent shadow-lg rounded-2xl min-w-0 w-full max-w-full overflow-auto h-[calc(100vh-80px)]"
      style={{ padding: "25px" }}
    >
      {/* Top bar with title and search */}
      <div
        className="flex justify-between items-center bg-[#eaf4f4] rounded-2xl"
        style={{ marginBottom: "60px", padding: "16px 24px" }}
      >
        <h1 className="text-2xl font-semibold text-gray-600">Home</h1>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div
            className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm"
            style={{ padding: "12px 8px" }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ marginLeft: "8px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>

          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user?.profileImg || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 object-cover"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg  shadow-sm w-50 dark:bg-gray-700 "
                style={{ padding: 0, marginTop: "8px" }}
              >
                <ul
                  className="text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDelayButton"
                  style={{ padding: "8px 0", margin: 0 }}
                >
                  <li>
                    <p  
                      onClick={() => setSelectedSection("settings")}
                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      style={{ padding: "8px 16px" }}
                    >
                      <KeyRoundIcon className="w-4 h-4" />
                      Change password
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() => setSelectedSection("settings")}
                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      style={{ padding: "8px 16px" }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </p>
                  </li>
                  <li>
                    <p
                      className="flex items-center gap-2 hover:bg-red-600  dark:hover:text-white"
                      style={{ padding: "8px 16px" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Row */}
      <div
        className="flex justify-center flex-wrap"
        style={{ marginBottom: "24px", gap: "24px" }}
      >
        {/* Orders Card */}
        <div
          onClick={() => setSelectedSection("order")}
          className="bg-[#8742dd] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{
            width: "300px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginBottom: "6px", fontSize: "15px" }}>Orders</div>
            <div style={{ fontSize: "26px", fontWeight: "600" }}>
              {totalOrder}
            </div>
          </div>
          <ShoppingCart className="w-9 h-9 text-white opacity-80" />
        </div>

        {/* All Products Card */}
        <div
          onClick={() => setSelectedSection("saved")}
          className="bg-[#3ed630] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{
            width: "300px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginBottom: "6px", fontSize: "15px" }}>
              All Products
            </div>
            <div style={{ fontSize: "26px", fontWeight: "600" }}>
              {totalProduct}
            </div>
          </div>
          <TagIcon className="w-9 h-9 text-white opacity-80" />
        </div>

        {/* Wishlist Card (Extra) */}
        <div
          onClick={() => setSelectedSection("wishlist")}
          className="bg-[#e9243e] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{
            width: "300px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ marginBottom: "6px", fontSize: "15px" }}>
              Users
            </div>
            <div style={{ fontSize: "26px", fontWeight: "600" }}>
              {totalUser}
            </div>
          </div>
          <Users className="w-9 h-9 text-white opacity-80" />
        </div>
      </div>
      {loader && <Loader/>}
    </div>
  );
};

export default Home;
