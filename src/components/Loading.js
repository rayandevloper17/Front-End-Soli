// Loading.js
import React from "react";
import { Lottie } from "lottie-react";
import loadingAnimation from "./loading.json"; // Path to your Lottie JSON file

const Loading = () => {
  return (
    <div className="loading-container">
      <Lottie animationData={loadingAnimation} loop />
    </div>
  );
};

export default Loading;
