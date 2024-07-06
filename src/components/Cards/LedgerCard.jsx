// src/ItemLedgerCard.js

import React, { useState } from "react";
import { TbArrowsExchange2 } from "react-icons/tb";
import { motion } from "framer-motion";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";

const LedgerCard = ({
  setOpenCashLedger,
  setOpenItemLedger,
  Data,
  setSelected,
}) => {
  const [customer, setCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [IsActive, setIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer:", customer);
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="w-fit mx-auto bg-[aliceblue] rounded-xl shadow-[rgba(0,0,0,0.16)_0px_1px_4px,#000_0px_0px_0px_3px] overflow-hidden">
      <div className="px-4 py-5 flex justify-center items-center flex-col">
        <h2 className="text-3xl mb-4 text-[#000] font-[700]">Ledger</h2>
        <form onSubmit={handleSubmit}>
          {/* First Row: Customer */}
          <div className="my-4 mt-6">
            <div
              className={
                IsActive
                  ? "flex justify-between items-center appearance-none border-2 border-[#0E2480] rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  : "flex justify-between items-center appearance-none border-2 border-[#0E2480] rounded w-full py-3 px-4 font-bold text-xl text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              }
              onClick={() => setIsActive(!IsActive)}
            >
              <div
                className={
                  IsActive ? "font-[700] text-xl" : "font-[400] text-xl"
                }
              >
                {customer === "" ? "Select Customer..." : customer}
              </div>
              {IsActive ? (
                <IoIosArrowDropupCircle className="text-[#0E2480] text-2xl" />
              ) : (
                <IoIosArrowDropdownCircle className="text-[#0E2480] text-2xl" />
              )}
            </div>
          </div>

          {/* Second Row: From Date and To Date */}
          <div className="flex justify-center gap-x-2 items-center mb-4">
            <div className="w-[35ch]">
              <label
                htmlFor="fromDate"
                className="block text-gray-700 text-xl mb-2 !font-[700]"
              >
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={
                  "appearance-none border-2 rounded-lg w-full py-3 px-3 text-xl font-[700] text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-black"
                }
                required
              />
            </div>
            <div className="flex items-end h-full">
              <TbArrowsExchange2 className="text-4xl" />
            </div>
            <div className="w-[35ch]">
              <label
                htmlFor="toDate"
                className="block text-gray-700 text-xl mb-2 !font-[700]"
              >
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={
                  "appearance-none border-2 rounded-lg w-full py-3 px-3 text-xl font-[700] text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-black"
                }
                required
              />
            </div>
          </div>

          {/* Third Row: Submit Button */}
          <div className="flex gap-x-3 items-center justify-center py-4">
            <motion.div
              className={`hover:bg-gray-500 bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                setOpenCashLedger(false);
                setOpenItemLedger(true);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Item Ledger
                </span>
              </div>
            </motion.div>
            <motion.div
              className={`hover:bg-gray-500 bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                setOpenCashLedger(true);
                setOpenItemLedger(false);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Cash Ledger
                </span>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerCard;
