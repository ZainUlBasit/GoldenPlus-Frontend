import { Popover, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import Navbar from "../../components/Navbar/Navbar";
import CustomerNav from "../../components/Navigations/CustomerNav";
import SimpleTable from "../../components/Tables/SimpleTable";
import { useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearhBox/SearchBox";
import { CompleteLedgerColumns } from "../../utils/ColumnsData/CompleteLedgerColumns";
import { fetchCustomerLedger } from "../../store/Slices/CustomerLegderSlice";
import DataLoader from "../../components/Loaders/DataLoader";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { fetchSupplierLedger } from "../../store/Slices/SupplierLegderSlice";

export default function SupplierCompleteLedger() {
  const [CurrentSupplier, setCurrentSupplier] = useState("");
  const [CurrentInvoiceData, setCurrentInvoiceData] = useState("");
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const AuthState = useSelector((state) => state.AuthState);
  const navigate = useNavigate();

  const CompanyState = useSelector((state) => state.CompanyState);
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSupplierSelect = (customer) => {
    setCurrentSupplier(customer);
    handleClose();
  };

  const [FetchingLoading, setFetchingLoading] = useState(false);
  const LedgerData = useSelector((state) => state.SupplierLegderState);

  useEffect(() => {
    if (CurrentSupplier) {
      dispatch(fetchSupplierLedger(CurrentSupplier._id));
    }
  }, [CurrentSupplier]);

  const [SearchText, setSearchText] = useState("");

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CustomerNav />
      <div className="flex gap-x-2 flex-wrap pt-4">
        <CustomPopOver
          label={"Select Supplier"}
          placeholder={"Select Supplier"}
          required={false}
          Value={
            CompanyState.data.find((dt) => dt._id === CurrentSupplier._id)
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
                      onClick={() => handleSupplierSelect(dt)}
                    >
                      <input
                        type="checkbox"
                        className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                        checked={CurrentSupplier._id === dt._id}
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
      {LedgerData.loading && CurrentSupplier && (
        <div className="flex justify-center items-center pt-4">
          <DataLoader />
        </div>
      )}
      {!LedgerData.loading && CurrentSupplier && (
        <div className="w-[85%] border-2 rounded-xl overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
              Supplier Name
            </div>
            <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
              {LedgerData.data.customer.name}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
              Opening Balance
            </div>
            <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
              {new Intl.NumberFormat("en-PK", {
                style: "currency",
                currency: "PKR",
              }).format(LedgerData.data.customer.opening_balance)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
              Closing Balance
            </div>
            <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
              {new Intl.NumberFormat("en-PK", {
                style: "currency",
                currency: "PKR",
              }).format(LedgerData.data.closing_balance)}
            </div>
          </div>
        </div>
      )}
      {!LedgerData.loading && CurrentSupplier && (
        <div className="flex justify-center items-center pt-4 w-[90%]">
          <SimpleTable
            columns={CompleteLedgerColumns}
            title={"Supplier Ledger"}
            rows={LedgerData.data.ledger}
            ReportTable={true}
          />
        </div>
      )}
    </div>
  );
}
