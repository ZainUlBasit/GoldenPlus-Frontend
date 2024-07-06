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

export default function CustomerLedger() {
  const [OpenItemLedger, setOpenItemLedger] = useState(false);
  const [OpenCashLedger, setOpenCashLedger] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [CurrentCustomer, setCurrentCustomer] = useState("");
  const CustomerState = useSelector((state) => state.CustomerState);
  const PaymentState = useSelector((state) => state.PaymentState);
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
          startDate: fromDate,
          endDate: toDate,
          branch: 1,
        })
      );
    } else if (OpenItemLedger) {
      dispatch(
        fetchCustomerItemLedger({
          customerId: CurrentCustomer,
          from: fromDate,
          to: toDate,
          // branch: 1,
        })
      );
    }
  }, [
    OpenCashLedger,
    OpenItemLedger,
    fromDate,
    toDate,
    CurrentCustomer,
    dispatch,
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CustomerNav />
      <ItemLedgerCard
        setOpenCashLedger={setOpenCashLedger}
        setOpenItemLedger={setOpenItemLedger}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        Users={CustomerState.data}
        SelectUser={CurrentCustomer}
        setSelectUser={setCurrentCustomer}
        Placeholder={"Select Customer"}
      />
      {OpenItemLedger &&
        (CustomerItemLegderState.loading ? (
          <ProcessLoader />
        ) : (
          <SimpleTable
            columns={CustomerItemLedgerColumns}
            title={"Item Ledger Details"}
            rows={CustomerItemLegderState.data}
          />
        ))}
      {OpenCashLedger &&
        (PaymentState.loading ? (
          <ProcessLoader />
        ) : (
          <SimpleTable
            columns={CashLedgerColumns}
            title={"Cash Ledger Details"}
            rows={PaymentState.data}
          />
        ))}
    </div>
  );
}
