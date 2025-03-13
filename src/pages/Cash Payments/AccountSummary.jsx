import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CashPaymentNav from "../../components/Navigations/CashPaymentNav";
import SimpleTable from "../../components/Tables/SimpleTable";
import {
  CashSummaryColumns,
  CustomerItemLedgerColumns,
} from "../../utils/ColumnsData/ItemLedgerColumns";
import AddAccountModal from "../../components/Modals/AddAccountModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "../../store/Slices/AccountsStatSlice";
import { fetchAccountsAmount } from "../../store/Slices/AccountSlice";
import AddAmountModal from "../../components/Modals/AddAmountModal";
import { fetchCashSummary } from "../../store/Slices/CashSummarySlice";
import CustomInput from "../../components/Inputs/CustomInput";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { CompleteLedgerColumns } from "../../utils/ColumnsData/CompleteLedgerColumns";
import moment from "moment";
import DataLoader from "../../components/Loaders/DataLoader";
import exportToExcel from "../../utils/ExportToExcel";

const AccountSummary = () => {
  const [OpenTypeModal, setOpenTypeModal] = useState(false);
  const [UpdateAmountModal, setUpdateAmountModal] = useState("");
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);
  const AccountState = useSelector((state) => state.AccountState);

  const [FromNewDate, setFromNewDate] = useState(
    moment().subtract(1, "years").toDate().toISOString().split("T")[0]
  );
  const [ToNewDate, setToNewDate] = useState(
    moment().toDate().toISOString().split("T")[0]
  );

  const LedgerData = useSelector((state) => state.CashSummaryState);

  useEffect(() => {
    dispatch(
      fetchCashSummary({
        branch: AuthState.data.branchId.branch_number,
        startDate: FromNewDate,
        endDate: ToNewDate,
      })
    );
  }, [FromNewDate, ToNewDate]);
  return (
    <div className="relative">
      <Navbar />
      <CashPaymentNav />
      <div className="flex items-center gap-x-2 max750:flex-col max750:w-full gap-y-1 py-2 justify-center">
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

      <div className="w-full flex justify-end px-2 py-3">
        <div
          className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            exportToExcel(LedgerData.data, "MyExcelFile");
          }}
        >
          Convert to Excel
        </div>
      </div>
      <div className="flex justify-center items-center">
        {LedgerData.loading ? (
          <div className="flex justify-center items-center pt-4">
            <DataLoader />
          </div>
        ) : (
          LedgerData.data && (
            <div className="flex justify-center items-center pt-4 w-[90%]">
              <SimpleTable
                columns={CompleteLedgerColumns}
                title={"Account Summary"}
                rows={LedgerData.data}
                ReportTable={true}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AccountSummary;
