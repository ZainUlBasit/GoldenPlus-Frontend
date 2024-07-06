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
        })
      );
    } else if (OpenReturnLedger) {
      dispatch(
        fetchReturnLedger({
          customerId: CurrentCustomer,
          from: fromDate,
          to: toDate,
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
        setOpenReturnLedger={setOpenReturnLedger}
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
          <>
            <SimpleTable
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
            </div>
          </>
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

      {OpenReturnLedger &&
        (ReturnState.loading ? (
          <ProcessLoader />
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
