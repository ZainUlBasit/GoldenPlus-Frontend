"use client";
import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import {
  CreateAccountApi,
  CreateCustomerApi,
  UpdateAccountsAmountApi,
} from "../../Https";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { fetchAccounts } from "../../store/Slices/AccountsStatSlice";
import { fetchAccountsAmount } from "../../store/Slices/AccountSlice";

const AddAmountModal = ({ OpenModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);

  const AccountState = useSelector((state) => state.AccountState);

  useEffect(() => {
    dispatch(
      fetchAccountsAmount({
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId : -1,
      })
    );
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { accountId, amount } = formData;

    if (!accountId || amount === undefined) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await UpdateAccountsAmountApi(formData);
      if (response.data.success) {
        SuccessToast(response.data.message);
        dispatch(
          fetchAccounts({
            branchId:
              AuthState.data.role === 2
                ? AuthState.data.branchId.branch_number
                : -1,
          })
        ); // Ensure you have a function to fetch customer data
        setOpenModal(false);
      }
    } catch (err) {
      ErrorToast(err.response.data.error.msg);
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
    <ModalWrapper open={OpenModal} setOpen={setOpenModal} title={"Add Amount"}>
      <div className="flex flex-col justify-center py-5 gap-y-3">
        <CustomPopOver
          label={"Select Account"}
          placeholder={"Select Account"}
          required={false}
          Value={
            formData.accountId !== ""
              ? AccountState.data.find((dt) => dt._id === formData.accountId)
                  .account_name
              : "Select Account"
          }
          onClick={(e) => handleClick(e)}
        />

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => handleClose()}
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
              borderColor: "#000",
              backgroundColor: "#000",
              width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                {AccountState.data &&
                  AccountState.data.map((dt) => (
                    <div
                      key={dt._id}
                      className="flex gap-x-3 items-center cursor-pointer"
                      onClick={() => {
                        handleChange("accountId", dt._id);
                        handleClose();
                      }}
                    >
                      <input
                        type="checkbox"
                        className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                        checked={formData.accountId === dt._id}
                        readOnly
                      />
                      <span>{dt.account_name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Typography>
        </Popover>
        <CustomInput
          id="amount"
          Type="number"
          label="Amount"
          placeholder="Enter Amount"
          Value={formData.amount}
          setValue={(value) => handleChange("amount", value)}
          required
        />
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Add Amount
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddAmountModal;
