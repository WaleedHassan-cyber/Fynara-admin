import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = () => {
  return (
    <div
      className="fixed inset-0 z-[999] flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", margin: "0" }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          width: "100%",
          maxWidth: "750px",
          height: "auto",
          overflowY: "auto",
          padding: "24px",
          margin: "0 auto",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/c241878e-ff94-4dad-853f-8e1574da4380/IdCdeYWHVM.lottie"
          loop
          autoplay
        />
        <h1 style={{ color: "white", fontSize: "24px" }}>Loading...</h1>
      </div>
    </div>
  );
};

export default Loader;
