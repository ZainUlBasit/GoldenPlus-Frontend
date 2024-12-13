import React from "react";

const NavigationsWrapper = ({ children }) => {
  return (
    <div className="flex justify-center items-center mt-[12vh] gap-x-2 flex-wrap gap-y-2 px-4 py-4 fade-in">
      {children}
    </div>
  );
};

export default NavigationsWrapper;
