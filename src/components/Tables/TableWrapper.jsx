import React from "react";

const TableWrapper = ({ children, className }) => {
  return (
    <div
      className={`w-[90%] max-w-[1200px] maxWeb1:max-w-[1900px] maxWeb2:max-w-[2500px] maxWeb3:max-w-[3800px] maxWeb4:max-w-[3400px]  border-[1px] border-[#465462] shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px] mb-10 relative mt-6 fade-in ${className} fade-in`}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
