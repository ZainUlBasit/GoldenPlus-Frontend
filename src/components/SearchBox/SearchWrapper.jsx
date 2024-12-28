import React from "react";

const SearchWrapper = ({ children }) => {
  return (
    <div className="flex justify-between items-center px-5 text-white font-[Quicksand] absolute -top-9 left-[-1px] w-[calc(100%+2px)] bg-[black] rounded-t-md">
      {children}
    </div>
  );
};

export default SearchWrapper;
