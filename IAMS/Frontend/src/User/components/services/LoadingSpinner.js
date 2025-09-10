import React, { useEffect, useState } from "react";

const LoadingSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set a timer to hide the spinner after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    // Clear the timer if the component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // If the spinner is not visible, return null to render nothing
  if (!visible) return null;

  return (
    // Fixed overlay to cover the entire screen, with a semi-transparent white background
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      {/* Container for the loading animation */}
      <div className="relative w-20 h-20">
        {/* Inner circle for the pulse effect */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping-slow opacity-75"></div>
        {/* Outer circle, slightly delayed pulse */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-ping-slower opacity-75 delay-300"></div>
        {/* Central dot/icon, could be an image or text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            XP
          </div>
        </div>
      </div>
      {/* Custom keyframe animations for ping-slow and ping-slower */}
      <style>
        {`
        @keyframes ping-slow {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes ping-slower {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-slower {
          animation: ping-slower 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
