import React from "react";
import TextField from "@mui/material/TextField";
// import { v4 } from "uuid";
import "./SimpleInput.css";

const SimpleInput = ({
  Type,
  label,
  placeholder,
  required,
  Value,
  setValue,
  readonly,
  disabled,
}) => {
  return (
    <div className="relative mb-[15px] w-[297px] maxInputWidth font-[Quicksand]">
      <p className="absolute top-[-11px] left-3 w-fit bg-white h-[13px] text-[15px] font-bold InputLabel">
        {label}
      </p>
      <input
        type={Type ? Type : "text"}
        required={required}
        // id={v4()}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-300 rounded-[7.94px] w-full outline-none InputText"
        value={Value}
        readOnly={readonly ? true : false}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value.length ? value : "");
        }}
        disabled={disabled ? disabled : false}
      />
    </div>
  );
};

export default SimpleInput;
