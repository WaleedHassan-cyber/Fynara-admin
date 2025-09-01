import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";

const History = () => {
  const URL = import.meta.env.VITE_API_URL
  const [selectedId, setSelectedId] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${URL}/api/reports`);
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">Loading...</div>
    );
  }

  // ✅ Helper functions
  // ✅ Helper function for only month
  const formatMonth = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", { month: "long" });

  const formatMonthDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  return (
    <div style={{ padding: "32px" }}>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "30px" }}
      >
        <h2
          className="text-3xl font-bold text-[#4f46e5]"
          style={{ marginBottom: "24px" }}
        >
          <span className="text-gray-400 text-[18px]">Home/ </span>
          History
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
        {reports.map((report) => {
          const { _id, targetId, totalEarned, profitLoss, dateGenerated } =
            report;

          const month = formatMonth(targetId.startDate); // ✅ Month + Date
          const duration = formatMonthDateTime(targetId.startDate); // ✅ Month + Date
          const generatedAt = formatMonthDateTime(dateGenerated); // ✅ Month + Date + Time

          return (
            <div
              key={_id}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 2px 12px rgba(60,60,100,0.08)",
                padding: "24px",
                width: "280px",
                cursor: "pointer",
                transition: "box-shadow .2s",
                position: "relative",
              }}
              onClick={() => setSelectedId(_id)}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "17px",
                  color: "#3f37c9",
                  marginBottom: 10,
                }}
              >
                Sales Report - {month}
              </div>
              <div style={{ fontSize: "14px", marginBottom: 8 }}>
                Duration: <span style={{ color: "#444" }}>{duration}</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: 8 }}>
                Target:{" "}
                <span style={{ color: "#444" }}>{targetId.amount} Rs</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: 8 }}>
                Achieved:{" "}
                <span style={{ color: "#444" }}>{totalEarned} Rs</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: 8 }}>
                {profitLoss < 0 ? "Loss" : "Profit"}:{" "}
                <span
                  style={{
                    color: profitLoss < 0 ? "#dc2f2f" : "#339966",
                  }}
                >
                  {profitLoss} Rs
                </span>
              </div>

              {selectedId === _id && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    background: "rgba(230,230,255,0.97)",
                    borderRadius: "18px",
                    width: "100%",
                    height: "100%",
                    zIndex: 2,
                    padding: "28px",
                    boxShadow: "0 2px 18px rgba(60,60,100,0.13)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(null);
                    }}
                    style={{
                      position: "absolute",
                      left: "86%",
                      top: "20px",
                      transform: "translateX(-50%)",
                      padding: "6px 12px",
                      borderRadius: "7px",
                      border: "none",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  >
                    <XIcon className="w-5 h-5 text-[#3f37c9]" />
                  </button>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#323",
                      marginBottom: "14px",
                    }}
                  >
                    Details
                  </div>
                  <pre
                    style={{
                      fontSize: "14px",
                      color: "#222",
                      whiteSpace: "pre-wrap",
                      marginBottom: "32px",
                    }}
                  >
                    {`Target: ${targetId.amount} Rs
Achieved: ${totalEarned} Rs
${profitLoss < 0 ? "Loss" : "Profit"}: ${profitLoss} Rs
Generated: ${generatedAt}`}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
