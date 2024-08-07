"use client";
import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useDispatch } from "react-redux";
import ProcessLoader from "../Loader/ProcessLoader";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { CreateCustomerApi, CreateNewBranchApi } from "../../Https";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";

const CreateBranchModal = ({ OpenModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch_number: "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { name, email, password, branch_number } = formData;

    if (!name || !email || !password || !branch_number) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      const response = await CreateNewBranchApi(formData);
      if (response.data.success) {
        SuccessToast(response.data.data.msg);
        dispatch(fetchCustomers({ branch: 1 })); // Ensure you have a function to fetch customer data
        setOpenModal(false);
      } else {
        ErrorToast(response.error.msg);
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
    <ModalWrapper
      open={OpenModal}
      setOpen={setOpenModal}
      title={"Create Branch"}
    >
      <div className="flex flex-col justify-center py-5">
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <CustomInput
              id="name"
              Type="text"
              label="Name"
              placeholder="Enter Name"
              Value={formData.name}
              setValue={(value) => handleChange("name", value)}
              required
            />

            <CustomInput
              id="email"
              Type="email"
              label="Email"
              placeholder="Enter Email"
              Value={formData.email}
              setValue={(value) => handleChange("email", value)}
              required
            />
            <CustomInput
              id="password"
              Type="password"
              label="Password"
              placeholder="Enter Password"
              Value={formData.password}
              setValue={(value) => handleChange("password", value)}
              required
            />
            <CustomPopOver
              label={"Select Branch"}
              placeholder={"Select Branch"}
              required={false}
              Value={formData.branch_number || "Select Branch"}
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
                          handleChange("branch_number", dt);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={formData.branch_number === dt}
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
              Create Branch
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateBranchModal;
