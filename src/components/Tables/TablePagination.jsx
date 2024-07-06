import { Popover, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
  FaCaretSquareLeft,
  FaCaretSquareRight,
} from "react-icons/fa";

const CustomPagination = ({
  count: totalCount,
  rowsPerPage: pageSize,
  page: currentPage,
  onPageChange,
  onRowsPerPageChange,
  RowsPerPage,
}) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handlePageChange = (newPage) => {
    if (newPage === "+" && currentPage < pageCount - 1) {
      onPageChange(currentPage + 1);
    } else if (newPage === "-" && currentPage >= 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handlePageSizeChange = (val) => {
    const newSize = parseInt(val, 10);
    onRowsPerPageChange(newSize);
  };

  const PerPage = [5, 10, 25];

  // Number of page numbers to show on each side of the current page
  const visiblePages = 1;

  // Calculate the range of visible page numbers
  const startPage = Math.max(1, currentPage - visiblePages);
  const endPage = Math.min(pageCount, currentPage + visiblePages);

  return (
    <div className="flex flex-col items-center justify-end my-2 pr-3">
      <span className="font-[Quicksand] text-black flex justify-center items-center gap-x-2 maxWeb1:text-[1.3rem] maxWeb2:text-[1.5rem] maxWeb3:text-[1.8rem] maxWeb4:text-[1.8rem]">
        Rows per page:
        <span className="text-[1rem] maxWeb1:text-[1.3rem] maxWeb2:text-[1.5rem] maxWeb3:text-[1.8rem] maxWeb4:text-[1.8rem] font-bold">
          {RowsPerPage}
        </span>
        <FaCaretDown
          className="text-[1rem] maxWeb1:text-[2rem] maxWeb2:text-[2.5rem] maxWeb3:text-[3rem] maxWeb4:text-[3rem] cursor-pointer"
          onClick={handleClick}
        />
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "25px",
            backgroundColor: "white",
            width: "110px",
            overflow: "hidden",
            marginTop: "10px",
            boxShadow: "none",
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
            pt: 2,
            pl: 2,
            pr: 5,
            pb: 2,
            borderColor: "#465462",
            backgroundColor: "#465462",
            overflow: "hidden",
            borderRadius: "20px",
          }}
        >
          <div className="bg-[#465462] text-white font-[Quicksand]  flex flex-col justify-center items-center rounded-[50px]">
            <div className="w-full flex flex-col justify-between gap-y-3 items-start">
              {PerPage.map((page_, i) => (
                <div
                  key={i}
                  className="flex gap-x-3 items-center cursor-pointer"
                  onClick={() => {
                    handlePageSizeChange(page_);
                    handleClose();
                  }}
                >
                  <input
                    type="checkbox"
                    className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                    checked={page_ === RowsPerPage}
                  />
                  <span>{page_}</span>
                </div>
              ))}
            </div>
          </div>
        </Typography>
      </Popover>
      <div className="flex justify-center my-1">
        <button onClick={() => handlePageChange("-")}>
          <FaCaretSquareLeft
            className={`${
              currentPage === 0 ? "text-gray-500" : "text-black"
            } text-[1.2rem] maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2rem] mr-2`}
          />
        </button>
        {pages.slice(startPage - 1, endPage).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              fontWeight: currentPage + 1 === page ? "bold" : "normal",
            }}
            className="font-[Quicksand] px-1 text-[1rem] maxWeb1:text-[1.3rem] maxWeb2:text-[1.5rem] maxWeb3:text-[1.8rem] maxWeb4:text-[1.8rem]"
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange("+")}>
          <FaCaretSquareRight
            className={`${
              currentPage === pageCount - 1 ? "text-gray-500" : "text-black"
            } text-[1.2rem] maxWeb1:text-[1.5rem] maxWeb2:text-[1.8rem] maxWeb3:text-[2rem] maxWeb4:text-[2rem] ml-2`}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
