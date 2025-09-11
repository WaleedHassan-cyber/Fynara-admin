import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Pencil,
} from "lucide-react";
import Loader from "./Loader.jsx";
import ProgressCircle from "./ProgressCircle.jsx";
import { toast,ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Analytics = () => {
  const URL = import.meta.env.VITE_API_URL;
  // Modal state and input states
  const [modalOpen, setModalOpen] = useState(false);
  const [inputTarget, setInputTarget] = useState("");
  const [durationOption, setDurationOption] = useState(30); // default 30 days duration
  const [loader, setloader] = useState(false);
  // Target and reset date state
  const [target, setTarget] = useState(0); // initial target $75k
  const [resetDate, setResetDate] = useState(null);
  const [allTotal, setAllTotal] = useState(0);
  const [targetTotal, setTargetTotal] = useState(0);
  // Countdown string to show above pencil icon
  const [countdown, setCountdown] = useState("");

  // Example earnings (replace with dynamic data if available)

  // Calculate percentage progress and remaining %
  const percentage =
    target > 0 ? Math.min(100, Math.round((targetTotal / target) * 100)) : 0;
  const remainingPercent = 100 - percentage;

  // Update countdown timer every second
 useEffect(() => {
  setloader(true);

  const fetchTarget = async () => {
    try {
      const res = await fetch(`${URL}/api/target`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json(); // 👈 zaroori hai
      console.log("response:", data);

      setAllTotal(data.allTotal);

      if (data.activeTarget) {
        setTarget(data.activeTarget.amount);
        setResetDate(new Date(data.activeTarget.endDate));
        setTargetTotal(data.activeTarget.targetTotal);
      } else {
        setTarget(0);
        setResetDate(null);
        setTargetTotal(0);
      }
    } catch (err) {
      console.error("Error fetching target:", err);
    } finally {
      // ✅ loader yahan band hoga
      setloader(false);
    }
  };

  fetchTarget();
}, []);

  // countdown logic
  useEffect(() => {
    const updateCountdown = () => {
      if (!resetDate) {
        setCountdown("");
        return;
      }

      const now = new Date();
      const diff = resetDate - now;

      if (diff <= 0) {
        // time up
        setTarget(0);
        setResetDate(null);
        setCountdown("");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(
          `${days}d ${hours}h ${minutes}m ${seconds}s left for target reset`
        );
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [resetDate]);

  // Confirm target with specific duration button handler

  const handleConfirm = async () => {
    const numTarget = Number(inputTarget);

    if (!isNaN(numTarget) && numTarget > 0) {
      setTarget(numTarget);

      const now = new Date();
      let resetTimeMs;

      if (durationOption === "1min") {
        resetTimeMs = 1 * 60 * 1000; // 1 minute
      } else if (durationOption === "15days") {
        resetTimeMs = 15 * 24 * 60 * 60 * 1000;
      } else if (durationOption === "30days") {
        resetTimeMs = 30 * 24 * 60 * 60 * 1000;
      } else if (durationOption === "60days") {
        resetTimeMs = 60 * 24 * 60 * 60 * 1000;
      } else {
        resetTimeMs = 30 * 24 * 60 * 60 * 1000; // default 30 days
      }

      const newResetDate = new Date(now.getTime() + resetTimeMs);
      setResetDate(newResetDate);

      // Prepare data for API
      const payload = {
        amount: numTarget,
        startDate: now.toISOString(),
        endDate: newResetDate.toISOString(),
      };

      // 👉 Wrap fetch in toast.promise
      await toast.promise(
        (async () => {
          const response = await fetch(`${URL}/api/set-target`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to set target");
          }

          const data = await response.json();
          console.log("Target saved:", data.target);

          // Close modal and reset input fields
          setModalOpen(false);
          setInputTarget("");

          return "Target saved successfully!";
        })(),
        {
          pending: "Creating your target...",
          success: "Target created successfully",
          error: {
            render({ data }) {
              return data?.message || "Error while saving target ❌";
            },
          },
        }
      );
    } else {
      toast.error("Please enter a valid positive number for the target.");
    }
  };

  return (
    <div
      className="bg-transparent min-w-0 w-full max-w-full overflow-auto"
      style={{ padding: "25px", position: "relative" }}
    >
      {/* Header and search bar */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "30px" }}
      >
        <h2
          className="text-3xl font-bold text-[#4f46e5]"
          style={{ marginBottom: "24px" }}
        >
          <span className="text-gray-400 text-[18px]">Home/ </span>
          Analytics
        </h2>
        <div
          className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm"
          style={{ padding: "16px 8px" }}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
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

      {/* Stats cards */}
      <div className="flex flex-wrap gap-5" style={{ marginBottom: "24px" }}>
        {/* Revenue */}
        <div
          className="bg-[#8945f0] w-full sm:w-[48%] lg:w-[23%] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{ padding: "24px" }}
        >
          <div>
            <div className="text-sm" style={{ marginBottom: "4px" }}>
              Revenue
            </div>
            <div className="text-2xl font-semibold">${allTotal}</div>
          </div>
          <DollarSign className="w-8 h-8 text-white opacity-80" />
        </div>
        {/* Profit */}
        <div
          className="bg-[#e4800f] w-full sm:w-[48%] lg:w-[23%] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{ padding: "24px" }}
        >
          <div>
            <div className="text-sm" style={{ marginBottom: "4px" }}>
              Profit
            </div>
            <div className="text-2xl font-semibold">$2.3k</div>
          </div>
          <TrendingUp className="w-8 h-8 text-white opacity-80" />
        </div>
        {/* Orders */}
        <div
          className="bg-[#45f070] w-full sm:w-[48%] lg:w-[23%] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{ padding: "24px" }}
        >
          <div>
            <div className="text-sm" style={{ marginBottom: "4px" }}>
              Orders
            </div>
            <div className="text-2xl font-semibold">811</div>
          </div>
          <ShoppingCart className="w-8 h-8 text-white opacity-80" />
        </div>
        {/* Users */}
        <div
          className="bg-[#2895d4] w-full sm:w-[48%] lg:w-[23%] text-white rounded-2xl flex justify-between items-center shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
          style={{ padding: "24px" }}
        >
          <div>
            <div className="text-sm" style={{ marginBottom: "4px" }}>
              Users
            </div>
            <div className="text-2xl font-semibold">764</div>
          </div>
          <Users className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      {/* Earnings, Sales, Performance */}
      <div className="flex flex-wrap gap-6">
        {/* Earnings card */}
        <div
          className="rounded-2xl w-full sm:w-[48%] lg:w-[31%] bg-white shadow-sm flex flex-col justify-between"
          style={{ padding: "24px" }}
        >
          <div>
            <div
              className="text-gray-600 text-sm"
              style={{ marginBottom: "8px" }}
            >
              Earnings
            </div>
            <div
              className="text-2xl font-semibold"
              style={{ marginBottom: "4px" }}
            >
              ${targetTotal}
            </div>
            <div
              className="flex justify-between items-center"
              style={{ marginBottom: "16px" }}
            >
              <span className="text-gray-500 text-sm">
                Target:{" "}
                <span className="text-[#4F46E5] font-bold">{target}</span>
              </span>
              <span className="text-gray-500 text-sm">
                Remaining:{" "}
                <span className="text-red-500">{remainingPercent}%</span>
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <ProgressCircle percentage={percentage} />
          </div>
        </div>

        {/* Sales */}
        <div
          className="rounded-2xl border-4 w-full sm:w-[48%] lg:w-[31%] border-[#c093ff] bg-white shadow-sm"
          style={{ padding: "24px" }}
        >
          <div
            className="text-center text-gray-600 text-sm"
            style={{ marginBottom: "16px" }}
          >
            Sales
          </div>
          <div className="flex justify-around" style={{ marginBottom: "16px" }}>
            <div className="text-gray-600 text-sm">
              Revenue
              <br />
              <span className="font-semibold text-black">$34,533</span>
            </div>
            <div className="text-gray-600 text-sm">
              Profit
              <br />
              <span className="font-semibold text-green-600">$2,345</span>
            </div>
            <div className="text-gray-600 text-sm">
              Orders
              <br />
              <span className="font-semibold text-black">811</span>
            </div>
          </div>
          <div
            className="w-full h-28 rounded-xl"
            style={{
              background:
                "linear-gradient(180deg,rgba(160, 154, 237, 1) 35%, rgba(100, 100, 245, 1) 62%, rgba(116, 213, 237, 1) 100%)",
            }}
          />
        </div>

        {/* Performance */}
        <div
          className="rounded-2xl w-full sm:w-[48%] lg:w-[31%] bg-white shadow-sm"
          style={{ padding: "24px" }}
        >
          <div
            className="text-gray-600 text-sm"
            style={{ marginBottom: "8px" }}
          >
            Performance
          </div>
          <div className="w-full h-48 bg-cyan-200 rounded-xl" />
        </div>
      </div>

      {/* Floating Pencil Icon with Countdown */}
      <div
        className=""
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          zIndex: 998,
          maxWidth: 140,
          textAlign: "center",
          fontSize: 13,
          color: "#4f46e5",
          fontWeight: "600",
        }}
      >
        <div className="text-rose-500">{countdown}</div>
        <div
          className={`border border-blue-300 rounded-full shadow-sm ${
            countdown
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#4F46E5] cursor-pointer"
          }`}
          style={{ padding: "12px 16px" }}
          onClick={() => {
            if (!countdown) {
              setModalOpen(true);
            }
          }}
        >
          <Pencil
            size={32}
            color="#ffffff"
            title={countdown ? "Disabled during countdown" : "Set Target"}
          />
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" />
      
      {/* Modal for setting target */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 10,
              minWidth: 320,
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16, color: "#4f46e5" }}>
              Set Target with Duration
            </h3>

            <input
              type="number"
              placeholder="Enter target in $"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 16,
                marginBottom: "12px",
                borderRadius: 6,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "600",
                color: "#4f46e5",
              }}
            >
              Select duration:
            </label>
            <select
              value={durationOption}
              onChange={(e) => setDurationOption(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 16,
                marginBottom: "20px",
                borderRadius: 6,
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            >
              <option value="15days">15 days</option>
              <option value="30days">30 days</option>
              <option value="60days">60 days (2 months)</option>
              <option value="1min">1 minute (test)</option>
            </select>

            <button
              onClick={handleConfirm}
              style={{
                backgroundColor: "#4f46e5",
                color: "white",
                padding: "12px 0",
                borderRadius: 6,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {loader && <Loader/>}
    </div>
  );
};

export default Analytics;
