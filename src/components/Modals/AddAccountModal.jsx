"use client";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useDispatch, useSelector } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { CreateAccountApi, CreateCustomerApi } from "../../Https";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";

const AddAccountModal = ({ OpenModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    account_name: "",
    account_no: "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { account_name, account_no } = formData;

    if (!account_name || !account_no) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await CreateAccountApi({
        ...formData,
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId : -1,
        branch_name: AuthState.data.role === 2 ? AuthState.data.name : -1,
      });
      if (response.data.success) {
        SuccessToast(response.data.message);
        dispatch(
          fetchCustomers({
            branch:
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
    <ModalWrapper open={OpenModal} setOpen={setOpenModal} title={"Add Account"}>
      <div className="flex flex-col justify-center py-5 gap-y-3">
        <CustomInput
          id="account_name"
          Type="text"
          label="Account Name"
          placeholder="Enter Account Name"
          Value={formData.account_name}
          setValue={(value) => handleChange("account_name", value)}
          required
        />

        <CustomInput
          id="account_no"
          Type="number"
          label="Account #"
          placeholder="Enter Account #"
          Value={formData.account_no}
          setValue={(value) => handleChange("account_no", value)}
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
              Add Account
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddAccountModal;
