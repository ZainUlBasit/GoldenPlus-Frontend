"use client";
import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import { useDispatch } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { UpdateExpensesApi } from "../../Https";
import { fetchExpenses } from "../../store/Slices/ExpenseSlice";
// import { fetchExpenses } from "../../store/Slices/ExpenseSlice"; // Update action import to fetchExpenses

const EditExpenseModal = ({
  OpenModal,
  setOpenModal,
  expense,
  payloadData,
}) => {
  const [formData, setFormData] = useState({
    desc: expense?.desc || "",
    expense: expense?.expense || "",
    branch: expense?.branch || "",
    date: expense
      ? new Date(expense.date * 1000).toISOString().split("T")[0]
      : "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (expense) {
      setFormData({
        desc: expense.desc,
        expense: expense.expense,
        branch: expense.branch,
        date: new Date(expense.date * 1000).toISOString().split("T")[0],
      });
    }
  }, [expense]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { desc, expense: expenseAmount, branch } = formData;

    if (!desc || !expenseAmount || !branch) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await UpdateExpensesApi({
        expenseId: expense._id,
        payload: formData,
      }); // Update API call to UpdateExpenseApi
      if (response.data.success) {
        SuccessToast(response.data.data.msg);
        dispatch(fetchExpenses(payloadData));
        // dispatch(fetchExpenses()); // Ensure you have a function to fetch expense data
        setOpenModal(false);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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

  return (
    <ModalWrapper
      open={OpenModal}
      setOpen={setOpenModal}
      title={"Edit Expense"}
    >
      <div className="flex flex-col justify-center py-5">
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <CustomInput
              id="desc"
              Type="text"
              label="Description"
              placeholder="Enter Description"
              Value={formData.desc}
              setValue={(value) => handleChange("desc", value)}
              required
            />
            <CustomInput
              id="expense"
              Type="number"
              label="Expense"
              placeholder="Enter Expense"
              Value={formData.expense}
              setValue={(value) => handleChange("expense", value)}
              required
            />
            <CustomInput
              id="date"
              Type="date"
              label="Date"
              placeholder="Select Date"
              Value={formData.date}
              setValue={(value) => handleChange("date", value)}
              required
            />
            <CustomPopOver
              label={"Select Branch"}
              placeholder={"Select Branch"}
              required={false}
              Value={formData.branch || "Select Branch"}
              onClick={handleClick}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: "25px", // Add rounded corners
                  backgroundColor: "white", // Set background color to white
                  width: "300px", // Set the width as needed
                  overflow: "hidden", // Hide overflowing content
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
                  borderColor: "#465462",
                  backgroundColor: "#465462",
                  width: "400px",
                  overflow: "hidden",
                  borderRadius: "25px",
                }}
              >
                <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                  <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                    {[1, 2, 3].map((dt) => (
                      <div
                        key={dt}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleClose();
                          //   handleChange("branch", dt);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={formData.branch === dt}
                          readOnly
                        />
                        <span>{dt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Typography>
            </Popover>
          </div>
        </div>
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Edit Expense
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditExpenseModal;
