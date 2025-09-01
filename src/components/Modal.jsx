import React from "react";
import "../assets/styles/SuccessLoader.css";
const Modal = ({ onClose, onConfirm, text, success, message }) => {
  return (
    <div
      className="fixed inset-0 z-[999] flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", margin: "0" }}
    >
      <div
        className="relative"
        style={{
          width: "100%",
          maxWidth: "550px", // ⬅️ Wider modal
          height: "auto",
           overflowY: "auto", // ⬅️ Taller modal
          padding: "24px", // ⬅️ Slightly more padding
          margin: "0 auto",
        }}
      >
        <div
          className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700"
          style={{ margin: "0" }}
        >
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            style={{ margin: "0" }}
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          <div
            className="text-center"
            style={{ padding: "16px 20px", margin: "0" }}
          >
            {success ? (
              <>
                {/* ✅ Show loader animation instead of icon */}
                <div
                  className="loading bg-gray-700"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "124px",
                    height: "124px",
                    margin: "0 auto 24px",
                    padding: "12px",
                    borderRadius: "12px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={124}
                    height={124}
                    viewBox="0 0 124 124"
                  >
                    <circle
                      className="circle-loading"
                      cx={62}
                      cy={62}
                      r={59}
                      fill="none"
                      stroke="hsl(140, 70%, 85%)
"
                      strokeWidth="6px"
                    />
                    <circle
                      className="circle"
                      cx={62}
                      cy={62}
                      r={59}
                      fill="none"
                      stroke="hsl(140, 80%, 45%)"
                      strokeWidth="6px"
                      strokeLinecap="round"
                    />
                    <polyline
                      className="check"
                      points="73.56 48.63 57.88 72.69 49.38 62"
                      fill="none"
                      stroke="hsl(140, 80%, 45%)"
                      strokeWidth="6px"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {message}{" "}
                  <span className="text-green-500 font-bold">
                    Successfully!
                  </span>
                </h3>
              </>
            ) : (
              <>
                {/* ❌ Show default warning icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  width={48}
                  height={48}
                  style={{
                    display: "block",
                    margin: "0 auto 20px",
                  }}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <h3
                  style={{
                    fontSize: "1.125rem", // Tailwind text-lg
                    fontWeight: "400", // Tailwind font-normal
                    color: "#d1d5db", // Tailwind text-gray-300
                    marginBottom: "20px",
                  }}
                >
                  Are you sure you want to delete this {text}?
                </h3>

                <button
                  onClick={onConfirm}
                  type="button"
                  style={{
                    padding: "10px 20px",
                    marginRight: "12px",
                    backgroundColor: "#dc2626", // red-600
                    color: "#fff",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#b91c1c")
                  } // red-800
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#dc2626")
                  }
                >
                  Yes, I'm sure
                </button>

                <button
                  onClick={onClose}
                  type="button"
                  style={{
                    padding: "10px 20px",
                    marginLeft: "0",
                    backgroundColor: "#1f2937", // dark:bg-gray-800
                    color: "#d1d5db", // text-gray-400
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "1px solid #4b5563", // border-gray-600
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#374151"; // gray-700
                    e.target.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#1f2937";
                    e.target.style.color = "#d1d5db";
                  }}
                >
                  No, cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
