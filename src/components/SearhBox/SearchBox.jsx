import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchBox = ({ Value, SetValue, Placeholder }) => {
  return (
    <div className="flex border-[1px] w-[300px] max-w-[98%] border-black items-center gap-x-2 px-3 py-[6px] rounded-full overflow-hidden bg-white">
      <BsSearch className="text-black" />
      <input
        className="outline-none w-full text-black"
        placeholder={Placeholder}
        value={Value}
        onChange={(e) => SetValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
