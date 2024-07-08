// src/ItemLedgerCard.js
import React, { useEffect, useState } from "react";
import { TbArrowsExchange2 } from "react-icons/tb";
import { motion } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";
import { Popover, Typography } from "@mui/material";
import SearchBox from "../SearhBox/SearchBox";

const ItemLedgerCard = ({
  setOpenCashLedger,
  setOpenItemLedger,
  setOpenReturnLedger,
  setSelectUser,
  SelectUser,
  Users,
  Placeholder,
  fromDate,
  toDate,
  setToDate,
  setFromDate,
}) => {
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //   const [CurrentCompany, setCurrentCompany] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [SearchText, setSearchText] = useState("");

  return (
    <div className="w-fit mx-auto bg-[aliceblue] rounded-xl shadow-[rgba(0,0,0,0.16)_0px_1px_4px,#000_0px_0px_0px_3px] overflow-hidden">
      <div className="px-4 py-5 flex justify-center items-center flex-col">
        <h2 className="text-3xl mb-4 text-[#000] font-[700]">Item Ledger</h2>
        <form onSubmit={handleSubmit}>
          {/* First Row: Customer */}
          <div className="my-4 mt-6">
            <div
              className="relative w-full font-[Quicksand]"
              onClick={handleClick}
            >
              <p className="absolute top-[-13px] left-3 w-fit bg-[aliceblue] font-[Quicksand] text-[18px] font-bold">
                {Placeholder}
              </p>
              <div
                className={`px-3 py-3 pr-10 border border-gray-300 rounded-[7.94px] w-full outline-none cursor-pointer text-lg ${
                  SelectUser !== "" && "font-bold"
                }`}
              >
                {SelectUser === ""
                  ? Placeholder
                  : Users.find((dt) => dt._id === SelectUser).name}
              </div>
              <BsChevronDown className="flex absolute right-3 top-[1.2rem] cursor-pointer" />
            </div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: "25px", // Add rounded corners
                  backgroundColor: "white", // Set background color to white
                  width: "400px", // Set the width as needed
                  overflow: "hidden", // Hide overflowing content
                  //   marginTop: "6px",
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Typography
                sx={{
                  p: 2,
                  borderColor: "#000",
                  backgroundColor: "#000",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "25px",
                  overflowY: "auto",
                  height: "60vh",
                }}
              >
                <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                  <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                    <SearchBox
                      Value={SearchText}
                      SetValue={setSearchText}
                      Placeholder={"Search Customer"}
                    />
                    {Users.filter((dt) => {
                      const lowerCaseSearch = SearchText.toLowerCase();
                      const lowerCaseStation = dt.name.toLowerCase();
                      if (SearchText !== "") {
                        return lowerCaseStation.includes(lowerCaseSearch);
                      } else {
                        return dt;
                      }
                    }).map((dt) => (
                      <div
                        key={dt._id}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleClose();
                          setSelectUser(dt._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={SelectUser === dt._id}
                          readOnly
                        />
                        <span>{dt.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Typography>
            </Popover>
          </div>

          {/* Second Row: From Date and To Date */}
          <div className="flex justify-center gap-x-2 items-center mb-4 flex-wrap">
            <div className={windowWidth < 800 ? "w-[100%]" : "w-[35ch]"}>
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
            <TbArrowsExchange2
              className={windowWidth < 800 ? "hidden" : "text-4xl"}
            />
            <div className={windowWidth < 800 ? "w-[100%]" : "w-[35ch]"}>
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
          <div className="flex gap-x-3 items-center justify-center py-4 flex-wrap gap-y-3">
            <motion.div
              className={`hover:bg-[#394b92] bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                setOpenCashLedger(false);
                setOpenItemLedger(true);
                setOpenReturnLedger(false);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Item Ledger
                </span>
              </div>
            </motion.div>
            <motion.div
              className={`hover:bg-[#394b92] bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                setOpenItemLedger(false);
                setOpenCashLedger(true);
                setOpenReturnLedger(false);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Cash Ledger
                </span>
              </div>
            </motion.div>
            <motion.div
              className={`hover:bg-[#394b92] bg-[#000] hover:rounded-lg text-white w-fit px-3 py-3 transition-all ease-in-out duration-500 cursor-pointer`}
              variants={item}
              onClick={() => {
                setOpenItemLedger(false);
                setOpenCashLedger(false);
                setOpenReturnLedger(true);
              }}
            >
              <div className="flex items-center gap-x-2 px-5">
                <span className="text-xl font-bold whitespace-nowrap">
                  Return Ledger
                </span>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemLedgerCard;
