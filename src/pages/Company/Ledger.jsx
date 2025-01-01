import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { StockStatsColumns } from "../../utils/ColumnsData/StockStatsColumns";
import ItemLedgerCard from "../../components/Cards/ItemLedgerCard";
import Navbar from "../../components/Navbar/Navbar";
import CompanyNav from "../../components/Navigations/CompanyNav";
import SimpleTable from "../../components/Tables/SimpleTable";
import ProcessLoader from "../../components/Loader/ProcessLoader";
import { fetchCompanyItemLedger } from "../../store/Slices/CompanyItemLegderSlice";
import { CashLedgerColumns } from "../../utils/ColumnsData/CashLedgerColumns";
import { fetchPaymentById } from "../../store/Slices/PaymentSlice";
import exportToExcel from "../../utils/ExportToExcel";
import DataLoader from "../../components/Loaders/DataLoader";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import CustomInput from "../../components/Inputs/CustomInput";
import SearchBox from "../../components/SearhBox/SearchBox";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import moment from "moment";
import { Popover, Typography } from "@mui/material";

export default function ComapnyLedger() {
  const [OpenItemLedger, setOpenItemLedger] = useState(false);
  const [OpenCashLedger, setOpenCashLedger] = useState(false);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  const CompanyState = useSelector((state) => state.CompanyState);
  const [CurrentCompany, setCurrentCompany] = useState("");
  const PaymentState = useSelector((state) => state.PaymentState);

  const [SearchText, setSearchText] = useState("");

  const CompanyItemLegderState = useSelector(
    (state) => state.CompanyItemLegderState
  );
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  const [CurrentTab, setCurrentTab] = useState("Item Ledger");
  const [anchorEl, setAnchorEl] = useState(null);

  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "years").toDate().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(
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

  useEffect(() => {
    dispatch(
      fetchCompanies({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, []);

  useEffect(() => {
    if (OpenCashLedger) {
      dispatch(
        fetchPaymentById({
          branch: AuthState.data.branchId.branch_number,
          user_Id: CurrentCompany._id,
          startDate: fromDate,
          endDate: toDate,
        })
      );
    }
  }, [OpenCashLedger, fromDate, toDate]);
  useEffect(() => {
    if (OpenItemLedger)
      dispatch(
        fetchCompanyItemLedger({
          branchId:
            AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
          companyId: CurrentCompany._id,
          startDate: fromDate,
          endDate: toDate,
        })
      );
  }, [OpenItemLedger, fromDate, toDate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CompanyNav />

      <div className="w-full flex justify-center items-center py-5">
        <div className="flex justify-between w-[90%] flex-wrap gap-3">
          {/* select customer card */}
          <CustomPopOver
            label={"Select Supplier"}
            placeholder={"Select Supplier"}
            required={false}
            Value={
              CompanyState.data.find((comp) => comp._id === CurrentCompany._id)
                ?.name || "Select Supplier"
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
                    Placeholder={"Search Supplier"}
                  />
                  {CompanyState.data
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
                          setCurrentTab("Item Ledger");
                          setCurrentCompany(dt);
                          handleClose();
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={CurrentCompany._id === dt._id}
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
              Value={fromDate}
              setValue={setFromDate}
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
              Value={toDate}
              setValue={setToDate}
              required
            />
          </div>
        </div>
      </div>

      {CurrentCompany && (
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
                setCurrentTab("Cash Ledger");
              }}
            >
              Cash
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end px-2 py-3">
        {(CompanyItemLegderState.data || PaymentState.data) && (
          <div
            className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
            onClick={() => {
              exportToExcel(CompanyItemLegderState.data, "MyExcelFile");
            }}
          >
            Convert to Excel
          </div>
        )}
      </div>
      {OpenItemLedger && CompanyItemLegderState.loading ? (
        <DataLoader />
      ) : (
        OpenItemLedger &&
        CompanyItemLegderState.data && (
          <SimpleTable
            columns={StockStatsColumns}
            title={"Item Ledger Details"}
            rows={CompanyItemLegderState.data}
          />
        )
      )}
      {OpenCashLedger && PaymentState.loading ? (
        <DataLoader />
      ) : (
        OpenCashLedger &&
        PaymentState.data && (
          <SimpleTable
            columns={CashLedgerColumns}
            title={"Cash Ledger Details"}
            rows={PaymentState.data}
          />
        )
      )}
    </div>
  );
}
