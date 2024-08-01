import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import { Typography, Popover } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CustomPopOver from "../Inputs/CustomPopOver";
import CustomInput from "../Inputs/CustomInput";
// import { BankNameData } from "@/utils/BankNameData";
import { CreatePaymentApi } from "../../Https";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { BankNameData } from "../../utils/BankNameData";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import ProcessLoader from "../Loader/ProcessLoader";
import SearchBox from "../SearhBox/SearchBox";
import { fetchAccountsAmount } from "../../store/Slices/AccountSlice";

const PaymentModal = ({ OpenModal, setOpenModal }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [depositor, setDepositor] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    if (
      userType !== "" &&
      userId !== "" &&
      depositor !== "" &&
      paymentType !== "" &&
      amount !== "" &&
      date !== "" &&
      desc !== ""
    ) {
      if (
        (paymentType === 2 || paymentType === 3) &&
        bankName === "" &&
        bankNumber === ""
      )
        ErrorToast("Required fields are undefined!");
      else {
        let paymentData = {
          user_type: userType,
          user_Id: userId,
          user_name: userName,
          depositor,
          payment_type: paymentType,
          amount: Number(amount),
          date,
          desc,
          branch: 1,
        };

        if (paymentType === 2 || paymentType === 3) {
          paymentData.bank_name = bankName;
          paymentData.bank_number = bankNumber;
        }
        try {
          const response = await CreatePaymentApi(paymentData);
          if (response.data.success) {
            SuccessToast(response.data.data.msg);
            setOpenModal(false);
          } else {
            ErrorToast(response.data.error.msg);
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      ErrorToast("Required fields are undefined!");
    }
    setLoading(false);
  };

  const CustomerState = useSelector((state) => state.CustomerState); // Ensure you have a slice to fetch users (companies and customers)
  const CompanyState = useSelector((state) => state.CompanyState); // Ensure you have a slice to fetch users (companies and customers)
  const AuthState = useSelector((state) => state.AuthState); // Ensure you have a slice to fetch users (companies and customers)

  const AccountState = useSelector((state) => state.AccountState);

  useEffect(() => {
    dispatch(
      fetchAccountsAmount({
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId : -1,
      })
    );
  }, []);

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
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElType, setAnchorElType] = useState(null);
  const [anchorElPayment, setAnchorElPayment] = useState(null);
  const [anchorElBank, setAnchorElBank] = useState(null);

  const handleClick = (event, type) => {
    if (type === "type") {
      setAnchorElType(event.currentTarget);
    } else if (type === "payment") {
      setAnchorElPayment(event.currentTarget);
    } else if (type === "bank") {
      setAnchorElBank(event.currentTarget);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (type) => {
    if (type === "type") {
      setAnchorElType(null);
    } else if (type === "payment") {
      setAnchorElPayment(null);
    } else if (type === "bank") {
      setAnchorElBank(null);
    } else {
      setAnchorEl(null);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const openType = Boolean(anchorElType);
  const idType = openType ? "user-type-popover" : undefined;
  const openPayment = Boolean(anchorElPayment);
  const idPayment = openPayment ? "payment-type-popover" : undefined;
  const openBank = Boolean(anchorElBank);
  const idBank = openBank ? "bank-name-popover" : undefined;

  const [CurrentUsername, setCurrentUsername] = useState("Select User");
  useEffect(() => {
    if (userType === 1) {
      setCurrentUsername(
        CompanyState.data.find((dt) => dt._id === userId)?.name || "Select User"
      );
    } else if (userType === 2) {
      setCurrentUsername(
        CustomerState.data.find((dt) => dt._id === userId)?.name ||
          "Select User"
      );
    } else {
      setCurrentUsername("Select User");
    }
  }, [userType, userId]);

  const paymentTypeOptions = [
    { value: 1, label: "Cash" },
    { value: 2, label: "Bank" },
    { value: 3, label: "Check" },
  ];

  const [SearchTextPop, setSearchTextPop] = useState("");

  return (
    <ModalWrapper open={OpenModal} setOpen={setOpenModal} title={"Add Payment"}>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 py-4">
        <div className="flex gap-x-4">
          <div className="flex flex-col gap-y-4">
            <CustomPopOver
              label={"Select User Type"}
              placeholder={"Select User Type"}
              required={false}
              Value={
                userType === 1
                  ? "Company"
                  : userType === 2
                  ? "Customer"
                  : "Select User"
              }
              onClick={(e) => handleClick(e, "type")}
            />
            <Popover
              id={idType}
              open={openType}
              anchorEl={anchorElType}
              onClose={() => handleClose("type")}
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
                    {[
                      { _id: 1, name: "Company" },
                      { _id: 2, name: "Customer" },
                    ].map((dt) => (
                      <div
                        key={dt._id}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleClose("type");
                          setUserType(dt._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={userType === dt._id}
                          readOnly
                        />
                        <span>{dt.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Typography>
            </Popover>

            <CustomPopOver
              label={"Select User"}
              placeholder={"Select User"}
              required={false}
              Value={CurrentUsername}
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
                  width: "auto", // Set the width as needed
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
                  width: "auto",
                  overflow: "hidden",
                  borderRadius: "25px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                  <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                    <SearchBox
                      Value={SearchTextPop}
                      SetValue={setSearchTextPop}
                      Placeholder={
                        userType === 1
                          ? "Search Company"
                          : userType === 2 && "Search Customer"
                      }
                    />
                    {userType === 1 &&
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
                              setUserId(dt._id);
                              setUserName(dt.name);
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                              checked={userId === dt._id}
                              readOnly
                            />
                            <span>{dt.name}</span>
                          </div>
                        ))}
                    {userType === 2 &&
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
                              setUserId(dt._id);
                              setUserName(dt.name);
                              handleClose();
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                              checked={userId === dt._id}
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
              id="depositor"
              Type="text"
              label="Depositor"
              placeholder="Enter Depositor"
              Value={depositor}
              setValue={(value) => setDepositor(value)}
              required
            />

            <CustomInput
              id="date"
              Type="date"
              label="Date"
              placeholder="Select Date"
              Value={date}
              setValue={(value) => setDate(value)}
              required
            />

            <CustomInput
              id="desc"
              Type="text"
              label="Description"
              placeholder="Enter Description"
              Value={desc}
              setValue={(value) => setDesc(value)}
              required
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <CustomPopOver
              label={"Select Payment Type"}
              placeholder={"Select Payment Type"}
              required={false}
              Value={
                paymentType === 1
                  ? "Cash"
                  : paymentType === 2
                  ? "Bank"
                  : paymentType === 3
                  ? "Check"
                  : "Select Payment Type"
              }
              onClick={(e) => handleClick(e, "payment")}
            />
            <Popover
              id={idPayment}
              open={openPayment}
              anchorEl={anchorElPayment}
              onClose={() => handleClose("payment")}
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
                    {paymentTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleClose("payment");
                          setPaymentType(option.value);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={paymentType === option.value}
                          readOnly
                        />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Typography>
            </Popover>

            {(paymentType === 2 || paymentType === 3) && (
              <>
                <CustomPopOver
                  label={"Select Bank"}
                  placeholder={"Select Bank"}
                  required={false}
                  Value={bankName || "Select Payment Type"}
                  onClick={(e) => handleClick(e, "bank")}
                />

                <Popover
                  id={idBank}
                  open={openBank}
                  anchorEl={anchorElBank}
                  onClose={() => handleClose("bank")}
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
                        {AccountState.data.map(({ _id, account_name }) => (
                          <div
                            key={_id}
                            className="flex gap-x-3 items-center cursor-pointer"
                            onClick={() => {
                              handleClose("bank");
                              setBankName(account_name);
                            }}
                          >
                            <input
                              type="checkbox"
                              className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                              checked={bankName === account_name}
                              readOnly
                            />
                            <span>{account_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Typography>
                </Popover>
                <CustomInput
                  id="bank-number"
                  Type="number"
                  label="Bank Number"
                  placeholder="Enter Bank Number"
                  Value={
                    AccountState.data.find((dt) => dt.account_name === bankName)
                      ?.account_no
                  }
                  setValue={(value) =>
                    setBankNumber(
                      AccountState.data.find(
                        (dt) => dt.account_name === bankName
                      )?.account_no
                    )
                  }
                />
              </>
            )}

            <CustomInput
              id="amount"
              Type="number"
              label="Amount"
              placeholder="Enter Amount"
              Value={amount}
              setValue={(value) => setAmount(value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="w-[100%] flex justify-center my-5 mt-1">
        {Loading ? (
          <ProcessLoader />
        ) : (
          <button
            onClick={handleSubmit}
            className="w-[50%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
          >
            Add Payment
          </button>
        )}
      </div>
    </ModalWrapper>
  );
};

export default PaymentModal;
