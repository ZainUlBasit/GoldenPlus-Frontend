import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { fetchPaymentById } from "../../store/Slices/PaymentSlice";
import { fetchCustomerItemLedger } from "../../store/Slices/CustomerItemLegderSlice";
import ItemLedgerCard from "../../components/Cards/ItemLedgerCard";
import ProcessLoader from "../../components/Loader/ProcessLoader";
import SimpleTable from "../../components/Tables/SimpleTable";
import { CustomerItemLedgerColumns } from "../../utils/ColumnsData/ItemLedgerColumns";
import { CashLedgerColumns } from "../../utils/ColumnsData/CashLedgerColumns";
import CustomerNav from "../../components/Navigations/CustomerNav";
import Navbar from "../../components/Navbar/Navbar";
import { fetchReturnLedger } from "../../store/Slices/ReturnSlice";
import { useNavigate } from "react-router-dom";
import exportToExcel from "../../utils/ExportToExcel";
import moment from "moment";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeletePaymentAPI } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";
import EditPaymentModal from "../../components/Modals/EditPaymentModal";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import SearchBox from "../../components/SearhBox/SearchBox";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import CustomInput from "../../components/Inputs/CustomInput";
import DataLoader from "../../components/Loaders/DataLoader";
import ItemLedgerTopTable from "../../components/Tables/ItemLedgerTopTable";
import ItemLedgerBottomTable from "../../components/Tables/ItemLedgerBottomTable";

export default function CustomerLedger() {
  const [OpenItemLedger, setOpenItemLedger] = useState(false);
  const [OpenCashLedger, setOpenCashLedger] = useState(false);
  const [OpenReturnLedger, setOpenReturnLedger] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [CurrentCustomer, setCurrentCustomer] = useState("");
  const CustomerState = useSelector((state) => state.CustomerState);
  const PaymentState = useSelector((state) => state.PaymentState);
  const ReturnState = useSelector((state) => state.ReturnState);
  const [OpenDeleteCashModal, setOpenDeleteCashModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [Loading, setLoading] = useState(false);

  const [CurrentTab, setCurrentTab] = useState("Item Ledger");
  const [SearchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [FromNewDate, setFromNewDate] = useState(
    moment().subtract(1, "years").toDate().toISOString().split("T")[0]
  );
  const [ToNewDate, setToNewDate] = useState(
    moment().toDate().toISOString().split("T")[0]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleCustomerSelect = (customer) => {
    setCurrentCustomer(customer._id);
    handleClose();
  };

  const navigate = useNavigate();
  const CustomerItemLegderState = useSelector(
    (state) => state.CustomerItemLegderState
  );
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchCustomers({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (OpenCashLedger) {
      dispatch(
        fetchPaymentById({
          user_Id: CurrentCustomer,
          startDate: FromNewDate,
          endDate: ToNewDate,
          branch: 1,
        })
      );
    } else if (OpenItemLedger) {
      dispatch(
        fetchCustomerItemLedger({
          customerId: CurrentCustomer,
          from: FromNewDate,
          to: ToNewDate,
        })
      );
    } else if (OpenReturnLedger) {
      dispatch(
        fetchReturnLedger({
          customerId: CurrentCustomer,
          from: FromNewDate,
          to: ToNewDate,
        })
      );
    }
  }, [
    OpenCashLedger,
    OpenItemLedger,
    FromNewDate,
    ToNewDate,
    CurrentCustomer,
    dispatch,
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CustomerNav />
      <div className="w-full flex justify-center items-center py-5">
        <div className="flex justify-between w-[90%] flex-wrap gap-3">
          {/* select customer card */}
          <CustomPopOver
            label={"Select Customer"}
            placeholder={"Select Customer"}
            required={false}
            Value={
              CustomerState.data.find((cust) => cust._id === CurrentCustomer)
                ?.name || "Select Customer"
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
                overflowY: "auto", // Ensure vertical scroll if needed
                maxHeight: "50vh", // Set height to 60vh
              }}
            >
              <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  <SearchBox
                    Value={SearchText}
                    SetValue={setSearchText}
                    Placeholder={"Search Customer"}
                  />
                  {CustomerState.data
                    .filter((dt) => {
                      const lowerCaseSearch = SearchText.toLowerCase();
                      const lowerCaseStation = dt.name.toLowerCase();
                      if (SearchText !== "") {
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
                          setOpenCashLedger(false);
                          setOpenItemLedger(true);
                          setOpenReturnLedger(false);
                          setCurrentTab("Item Ledger");
                          handleCustomerSelect(dt);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={CurrentCustomer === dt._id}
                          readOnly
                        />
                        <span>{dt.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Typography>
          </Popover>
          <div className="flex items-center gap-x-2 max750:flex-col max750:w-full gap-y-1 py-2">
            {/* from date */}

            <CustomInput
              id="from-date"
              // id="amount"
              Type="date"
              label="From"
              placeholder="Select From Date"
              Value={FromNewDate}
              setValue={setFromNewDate}
              required
            />

            {/* arrow icon */}
            <FaArrowRightArrowLeft className="text-black max750:hidden" />
            <CgArrowsExchangeAltV className="text-3xl text-black hidden max750:flex" />
            {/* to date */}
            <CustomInput
              id="to-date"
              // id="amount"
              Type="date"
              label="To"
              placeholder="Select To Date"
              Value={ToNewDate}
              setValue={setToNewDate}
              required
            />
          </div>
        </div>
      </div>
      {CurrentCustomer && (
        <div className="w-full flex justify-center">
          <div className="w-[90%] flex justify-center items-center bg-[#EFE7EC] rounded-[40px] font-[700] text-[1.5rem] mt-5 mb-8 max300:w-[95%]">
            <div
              className={`w-[50%] flex justify-center items-center rounded-[40px] ${
                CurrentTab === "Item Ledger"
                  ? "bg-[#000] text-white"
                  : "bg-[#EFE7EC] text-[#000]"
              } py-3 transition-all ease-in-out duration-700 cursor-pointer max767:py-2 max480:text-[1.1rem] max300:text-[.8rem]`}
              onClick={() => {
                setOpenCashLedger(false);
                setOpenItemLedger(true);
                setOpenReturnLedger(false);
                setCurrentTab("Item Ledger");
              }}
            >
              Item
            </div>
            <div
              className={`w-[50%] flex justify-center items-center rounded-[40px] ${
                CurrentTab === "Cash Ledger"
                  ? "bg-[#000] text-white"
                  : "bg-[#EFE7EC] text-[#000]"
              } py-3 transition-all ease-in-out duration-700 cursor-pointer max767:py-2 max480:text-[1.1rem] max300:text-[.8rem]`}
              onClick={() => {
                setOpenItemLedger(false);
                setOpenCashLedger(true);
                setOpenReturnLedger(false);
                setCurrentTab("Cash Ledger");
              }}
            >
              Cash
            </div>
            <div
              className={`w-[50%] flex justify-center items-center rounded-[40px] ${
                CurrentTab === "Return Ledger"
                  ? "bg-[#000] text-white"
                  : "bg-[#EFE7EC] text-[#000]"
              } py-3 transition-all ease-in-out duration-700 cursor-pointer max767:py-2 max480:text-[1.1rem] max300:text-[.8rem]`}
              onClick={() => {
                setOpenItemLedger(false);
                setOpenCashLedger(false);
                setOpenReturnLedger(true);
                setCurrentTab("Return Ledger");
              }}
            >
              Return
            </div>
          </div>
        </div>
      )}
      {/* <ItemLedgerCard
        setOpenCashLedger={setOpenCashLedger}
        setOpenItemLedger={setOpenItemLedger}
        setOpenReturnLedger={setOpenReturnLedger}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        Users={CustomerState.data}
        SelectUser={CurrentCustomer}
        setSelectUser={setCurrentCustomer}
        Placeholder={"Select Customer"}
      /> */}
      <div className="w-full flex justify-end px-2 py-3 mb-6">
        {CurrentCustomer && (
          <div
            className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
            onClick={() => {
              exportToExcel(
                OpenCashLedger
                  ? PaymentState.data
                  : OpenItemLedger
                  ? CustomerItemLegderState.data
                  : OpenReturnLedger && ReturnState.data,
                `${
                  OpenCashLedger
                    ? "Cash Ledger"
                    : OpenItemLedger
                    ? "Item Ledger"
                    : OpenReturnLedger && "Return Ledger"
                }-${moment(new Date()).format("DD MMMM YYYY")}`
              );
            }}
          >
            Convert to Excel
          </div>
        )}
      </div>
      {OpenItemLedger &&
        (CustomerItemLegderState.loading ? (
          <DataLoader />
        ) : (
          CustomerItemLegderState.data.map((item_data) => {
            return (
              <>
                <div className="w-[98%] max-w-[1400px] maxWeb1:max-w-[1900px] maxWeb2:max-w-[2500px] maxWeb3:max-w-[3800px] maxWeb4:max-w-[3400px] border-[1px] border-[#465462] shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px] mb-10 relative">
                  <div className="flex justify-between items-center text-white absolute -top-8 left-[-1px] w-[calc(100%+2px)] bg-[#465462] overflow-hidden rounded-t-md">
                    <ItemLedgerTopTable Data={item_data} />
                  </div>
                  <ItemLedgerBottomTable Data={item_data} />
                </div>
                {/* <SimpleTable
              columns={CustomerItemLedgerColumns}
              title={"Item Ledger Details"}
              rows={CustomerItemLegderState.data}
            />
            <div className="flex gap-x-2 my-5">
              <div
                className="px-2 py-2 border-2 border-black hover:rounded-lg transition-all ease-in-out duration-500 hover:bg-gray-600 bg-black text-white hover:text-white cursor-pointer w-[200px] flex justify-center items-center font-bold"
                onClick={() => {
                  navigate("/customer/item-ledger-report", {
                    state: {
                      id: CurrentCustomer, // Your state data here
                      from: fromDate,
                      to: toDate,
                    },
                  });
                }}
              >
                Print Item Ledger
              </div>
            </div> */}
              </>
            );
          })
        ))}
      {OpenCashLedger &&
        (PaymentState.loading ? (
          <DataLoader />
        ) : (
          <SimpleTable
            columns={CashLedgerColumns}
            title={"Cash Ledger Details"}
            rows={PaymentState.data}
            setOpenDeleteModal={setOpenDeleteCashModal}
            setSelected={setSelected}
            setOpenEditModal={setOpenEditModal}
          />
        ))}
      {OpenEditModal && (
        <EditPaymentModal
          OpenModal={OpenEditModal}
          setOpenModal={setOpenEditModal}
          paymentData={Selected}
        />
      )}
      {OpenDeleteCashModal && (
        <DeleteModal
          Open={OpenDeleteCashModal}
          setOpen={setOpenDeleteCashModal}
          onSubmit={async () => {
            setLoading(true);
            try {
              const response = await DeletePaymentAPI(Selected._id);
              if (response.data.success) {
                SuccessToast(response.data.data.msg);
                setOpenDeleteCashModal(false);
                dispatch(
                  fetchPaymentById({
                    user_Id: CurrentCustomer,
                    startDate: fromDate,
                    endDate: toDate,
                    branch: 1,
                  })
                );
              }
            } catch (err) {
              console.log(err);
            }
            setLoading(false);
          }}
          Loading={Loading}
        />
      )}
      {OpenReturnLedger &&
        (ReturnState.loading ? (
          <DataLoader />
        ) : (
          <SimpleTable
            columns={CustomerItemLedgerColumns}
            title={"Return Ledger Details"}
            rows={ReturnState.data}
          />
        ))}
    </div>
  );
}
