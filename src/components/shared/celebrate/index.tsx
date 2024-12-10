import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const Celebrate = ({ show }: { show: boolean }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 1000, overflow: "hidden" }}
    >
      {show && <Confetti width={dimensions.width} height={dimensions.height} />}
    </div>
  );
};

Celebrate.displayName = "Celebrate";

export default Celebrate;
