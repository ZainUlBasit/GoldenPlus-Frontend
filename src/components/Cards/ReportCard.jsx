// src/ItemLedgerCard.js
import React, { useState } from "react";
import { TbArrowsExchange2 } from "react-icons/tb";
import { motion } from "framer-motion";

const ReportCard = ({
  title,
  setOpenReport,
  fromDate,
  toDate,
  setToDate,
  setFromDate,
}) => {
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
        <h2 className="text-3xl mb-4 text-[#000] font-[700]">{title}</h2>
        <form>
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
                  "appearance-none border rounded w-full py-3 px-3 text-xl font-[700] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                }
                required
              />
            </div>
            <TbArrowsExchange2 className="text-4xl" />
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
                  "appearance-none border rounded w-full py-3 px-3 text-xl font-[700] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                }
                required
              />
            </div>
          </div>

          {/* Third Row: Submit Button */}
          <div className="flex gap-x-3 items-center justify-center py-4">
            <motion.div
              className={`hover:bg-[#394b92] bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                title, setOpenReport(true);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Show Report
                </span>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCard;
