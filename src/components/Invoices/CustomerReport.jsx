import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { GetInvoiceDataApi } from "../../Https";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import CustomerNav from "../Navigations/CustomerNav";
import moment from "moment";
import SimpleTable from "../Tables/SimpleTable";
import { BillItemColumns } from "../../utils/ColumnsData/BillItemColumns";
import PrintSimpleTable from "../Tables/PrintSimpleTable";
import { useDispatch, useSelector } from "react-redux";
import AddingLoader from "../Loaders/AddingLoader";
import { FaArrowLeft } from "react-icons/fa";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { ReportItemColumns } from "../../utils/ColumnsData/ReportItemColumns";
import { fetchCustomerItemLedger } from "../../store/Slices/CustomerItemLegderSlice";
import { CustomerReportColumns } from "../../utils/ColumnsData/CustomerReportColumns";

const CustomerReport = () => {
  const location = useLocation();
  const state = location.state;
  console.log(state);
  // return;
  const [FetchingLoading, setFetchingLoading] = useState(false);
  const AuthState = useSelector((state) => state.AuthState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const CustomerState = useSelector((state) => state.CustomerState);

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

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const totalAmount = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.total, 0);
  }, [CustomerState.data, state.city]);
  const returnAmount = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.return_amount, 0);
  }, [CustomerState.data, state.city]);
  const openingBalance = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.opening_balance, 0);
  }, [CustomerState.data, state.city]);
  const discountAmount = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.discount, 0);
  }, [CustomerState.data, state.city]);
  const recievedAmount = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.paid, 0);
  }, [CustomerState.data, state.city]);
  const recievealeAmount = useMemo(() => {
    return CustomerState.data
      .filter((dt) => {
        return state.city === "All" || dt.address === state.city;
      })
      .reduce((acc, cust) => acc + cust.remaining, 0);
  }, [CustomerState.data, state.city]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      {/* <CustomerNav /> */}
      {!FetchingLoading && (
        <div className="mt-[12vh] flex items-center justify-center gap-x-3 relative w-full">
          <button
            className="px-2 py-2 border-2 border-black hover:rounded-lg transition-all ease-in-out duration-500 hover:bg-gray-600 bg-black text-white hover:text-white cursor-pointer w-[200px] flex justify-center items-center font-bold my-3"
            onClick={() => {
              handlePrint(null, () => contentToPrint.current);
            }}
          >
            PRINT
          </button>
          <div
            className="border-2 border-black px-2 py-2 rounded-full hover:text-white hover:bg-black transition-all ease-in-out duration-700 cursor-pointer absolute top-0 left-5"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </div>
        </div>
      )}

      {CustomerState.loading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <AddingLoader />
        </div>
      ) : (
        <div ref={contentToPrint} className="flex flex-col w-auto p-1">
          <img
            src={`/${
              AuthState.data.role === 2
                ? AuthState.data.branchId.branch_number
                : -1
            }.png`}
            alt="banner"
            className="w-[100%] h-auto border-2 border-[#002650] rounded-t-lg"
          />
          {/* customer details */}
          <div className="flex w-full bg-[#002650] text-white justify-center items-center py-3 font-bold text-2xl px-3 mt-1">
            Customer Details
          </div>

          {CustomerState.data && (
            <div className="flex w-full">
              <PrintSimpleTable
                rows={CustomerState.data.filter((dt) => {
                  return state.city === "All" || dt.address === state.city;
                })}
                columns={CustomerReportColumns}
                bgColor={"#002650"}
              />
            </div>
          )}
          <div className="flex justify-center items-center w-full flex-col my-2 gap-y-2">
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Total Amount:</div>
              <div className="">{Number(totalAmount).toLocaleString()} /-</div>
            </div>
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Return Amount:</div>
              <div className="">{Number(returnAmount).toLocaleString()} /-</div>
            </div>
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Opening Balance:</div>
              <div className="">
                {Number(openingBalance).toLocaleString()} /-
              </div>
            </div>
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Discount:</div>
              <div className="">
                {Number(discountAmount).toLocaleString()} /-
              </div>
            </div>
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Recieved:</div>
              <div className="">
                {Number(recievedAmount).toLocaleString()} /-
              </div>
            </div>
            <div className="flex gap-x-1 font-bold text-xl">
              <div className="">Recievable:</div>
              <div className="">
                {Number(recievealeAmount).toLocaleString()} /-
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col w-full justify-end items-end px-3 py-3 gap-y-3">
            <div className="font-bold">
              Total:{" "}
              {Number(
                CustomerState.data &&
                  CustomerState.data.find((dt) => dt._id === state.id).total
              ).toLocaleString()}
              /-
            </div>{" "}
            <div className="font-bold">
              Discount:{" "}
              {Number(
                CustomerState.data &&
                  CustomerState.data.find((dt) => dt._id === state.id).discount
              ).toLocaleString()}
              /-
            </div>
            <div className="font-bold">
              Return Item Total:{" "}
              {Number(
                CustomerState.data &&
                  CustomerState.data.find((dt) => dt._id === state.id)
                    .return_amount
              ).toLocaleString()}
              /-
            </div>
            <div className="font-bold">
              Recieved:{" "}
              {Number(
                CustomerState.data &&
                  CustomerState.data.find((dt) => dt._id === state.id).paid
              ).toLocaleString()}
              /-
            </div>
            <div className="font-bold">
              Recieveable:{" "}
              {Number(
                CustomerState.data &&
                  CustomerState.data.find((dt) => dt._id === state.id).remaining
              ).toLocaleString()}
              /-
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CustomerReport;
