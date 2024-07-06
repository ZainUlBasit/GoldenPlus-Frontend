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

export default function ComapnyLedger() {
  const [OpenItemLedger, setOpenItemLedger] = useState(false);
  const [OpenCashLedger, setOpenCashLedger] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const CompanyState = useSelector((state) => state.CompanyState);
  const [CurrentCompany, setCurrentCompany] = useState("");
  const PaymentState = useSelector((state) => state.PaymentState);
  const CompanyItemLegderState = useSelector(
    (state) => state.CompanyItemLegderState
  );
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

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
    if (OpenCashLedger)
      dispatch(
        fetchPaymentById({
          branch: 1,
          user_Id: CurrentCompany,
          startDate: fromDate,
          endDate: toDate,
        })
      );
  }, [OpenCashLedger, fromDate, toDate]);
  useEffect(() => {
    if (OpenItemLedger)
      dispatch(
        fetchCompanyItemLedger({
          companyId: CurrentCompany,
          branch: 1,
          startDate: fromDate,
          endDate: toDate,
        })
      );
  }, [OpenItemLedger, fromDate, toDate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CompanyNav />
      <ItemLedgerCard
        setOpenCashLedger={setOpenCashLedger}
        setOpenItemLedger={setOpenItemLedger}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        Users={CompanyState.data}
        SelectUser={CurrentCompany}
        setSelectUser={setCurrentCompany}
        Placeholder={"Select Supplier"}
      />
      {OpenItemLedger && CompanyItemLegderState.loading ? (
        <ProcessLoader />
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
        <ProcessLoader />
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
