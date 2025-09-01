import React, { useEffect, useState } from "react";

const ProgressCircle = ({ percentage = 75, size = 120 }) => {
  const [animate, setAnimate] = useState(false);
  const [hovered, setHovered] = useState(false);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getOffset = (value) => circumference - (value / 100) * circumference;

  const [currentOffset, setCurrentOffset] = useState(circumference);

  // Animate on page load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(true);
      setCurrentOffset(getOffset(percentage));
    }, 300); // slight delay for smoothness
    return () => clearTimeout(timeout);
  }, [percentage]);

  // Hover effect
  const handleMouseEnter = () => {
    setHovered(true);
    setCurrentOffset(getOffset(percentage));
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setCurrentOffset(getOffset(percentage));
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated progress circle */}
        <circle
          className="text-indigo-600 transition-all duration-1000 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute text-lg font-semibold text-indigo-600">
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressCircle;
