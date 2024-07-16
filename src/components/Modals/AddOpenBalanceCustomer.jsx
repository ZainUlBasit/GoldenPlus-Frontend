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
  CreateCustomerApi,
  UpdateCompanyOpeningBalanceApi,
  UpdateCustomerOpeningBalanceApi,
} from "../../Https";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { BsSearch } from "react-icons/bs";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import SearchBox from "../SearhBox/SearchBox";

const AddOpenBalanceCustomer = ({ OpenModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    userId: "",
    opening_balance: "",
  });

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const AuthState = useSelector((state) => state.AuthState);
  const CustomerState = useSelector((state) => state.CustomerState);
  const CompanyState = useSelector((state) => state.CompanyState); // Ensure you have a slice to fetch users (companies and customers)

  const [SearchCustomer, setSearchCustomer] = useState("");
  useEffect(() => {
    dispatch(
      fetchCustomers({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
    dispatch(
      fetchCompanies({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, [dispatch]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const { userId, opening_balance } = formData;

    if (!userId || !opening_balance) {
      ErrorToast("Required fields are undefined");
      setLoading(false);
      return;
    }

    try {
      if (oldBalance === "customer") {
        const response = await UpdateCustomerOpeningBalanceApi({
          customerId: formData.userId,
          newBalance: Number(formData.opening_balance),
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
      } else if (oldBalance === "supplier") {
        const response = await UpdateCompanyOpeningBalanceApi({
          companyId: formData.userId,
          newBalance: Number(formData.opening_balance),
        });
        if (response.data.success) {
          SuccessToast(response.data.message);
          dispatch(
            fetchCompanies({
              branch:
                AuthState.data.role === 2
                  ? AuthState.data.branchId.branch_number
                  : -1,
            })
          ); // Ensure you have a function to fetch customer data
          setOpenModal(false);
        }
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

  const [oldBalance, setOldBalance] = useState("customer");

  const handleChangeE = (e) => {
    setOldBalance(e.target.value);
  };

  const [SearchTextPop, setSearchTextPop] = useState("");

  return (
    <ModalWrapper
      open={OpenModal}
      setOpen={setOpenModal}
      title={"Opening Balance"}
    >
      <div className="flex flex-col justify-center py-5">
        <div className="flex my-4 gap-x-3 justify-center items-start">
          <div className="flex items-center gap-x-2">
            <input
              type="radio"
              id="customer"
              name="type"
              value={"customer"}
              checked={oldBalance === "customer"}
              onChange={handleChangeE}
            />
            <label htmlFor="customer">Customer</label>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              type="radio"
              id="supplier"
              name="type"
              value={"supplier"}
              checked={oldBalance === "supplier"}
              onChange={handleChangeE}
            />
            <label htmlFor="supplier">Supplier</label>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          <div className="flex flex-col gap-y-4">
            <CustomPopOver
              label={
                oldBalance === "customer"
                  ? "Select Customer"
                  : "Select Supplier"
              }
              placeholder={
                oldBalance === "customer"
                  ? "Select Customer"
                  : "Select Supplier"
              }
              required={false}
              Value={
                CustomerState.data.find((dt) => dt._id === formData.customerId)
                  ?.name || oldBalance === "customer"
                  ? "Select Customer"
                  : "Select Supplier"
              }
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
                  // width: "300px", // Set the width as needed
                  height: "60vh", // Set height to 60vh
                  overflowY: "auto", // Add vertical scroll
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
                  // width: "400px",
                  borderRadius: "25px",
                  overflowY: "auto", // Ensure vertical scroll if needed
                  height: "60vh", // Set height to 60vh
                }}
              >
                <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                  <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                    <SearchBox
                      Value={SearchTextPop}
                      SetValue={setSearchTextPop}
                      Placeholder={
                        oldBalance === "supplier"
                          ? "Search Company"
                          : oldBalance === "customer" && "Search Customer"
                      }
                    />
                    {oldBalance === "supplier" &&
                      CompanyState.data
                        .filter((dt) => {
                          const lowerCaseSearch = SearchTextPop.toLowerCase();
                          const lowerCaseStation = dt.name.toLowerCase();
                          if (SearchTextPop !== "") {
                            return lowerCaseStation.includes(lowerCaseSearch);
                          } else {
                            return dt;
                          }
                        })
                        .map((dt) => (
                          <div
                            key={dt._id}
                            className="flex gap-x-3 items-center cursor-pointer"
                            onClick={() => {
                              handleClose();
                              handleChange("userId", dt._id);
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                              checked={formData.userId === dt._id}
                              readOnly
                            />
                            <span>{dt.name}</span>
                          </div>
                        ))}
                    {oldBalance === "customer" &&
                      CustomerState.data
                        .filter((dt) => {
                          const lowerCaseSearch = SearchTextPop.toLowerCase();
                          const lowerCaseStation = dt.name.toLowerCase();
                          if (SearchTextPop !== "") {
                            return lowerCaseStation.includes(lowerCaseSearch);
                          } else {
                            return dt;
                          }
                        })
                        .map((dt) => (
                          <div
                            key={dt._id}
                            className="flex gap-x-3 items-center cursor-pointer"
                            onClick={() => {
                              handleChange("userId", dt._id);
                              handleClose();
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                              checked={formData.userId === dt._id}
                              readOnly
                            />
                            <span>{dt.name}</span>
                          </div>
                        ))}
                  </div>
                </div>
              </Typography>
            </Popover>

            <CustomInput
              id="opening-balance"
              Type="number"
              label="Opening Balance"
              placeholder="Enter Openeing Balance"
              Value={formData.opening_balance}
              setValue={(value) => handleChange("opening_balance", value)}
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500 capitalize"
            >
              Update {oldBalance}
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddOpenBalanceCustomer;
