import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { GetInvoiceDataApi } from "../../Https";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import CustomerNav from "../Navigations/CustomerNav";
import moment from "moment";
import SimpleTable from "../Tables/SimpleTable";
import { BillItemColumns } from "../../utils/ColumnsData/BillItemColumns";
import PrintSimpleTable from "../Tables/PrintSimpleTable";
import { useSelector } from "react-redux";
import AddingLoader from "../Loaders/AddingLoader";
import { FaArrowLeft } from "react-icons/fa";

const NewBillInvoice = () => {
  const [CurrentInvoiceData, setCurrentInvoiceData] = useState("");
  const [FetchingLoading, setFetchingLoading] = useState(false);
  const AuthState = useSelector((state) => state.AuthState);
  const { id: CurrentBillNo } = useParams();
  const navigate = useNavigate();
  const GetInvoiceData = async () => {
    setFetchingLoading(true);
    try {
      const response = await GetInvoiceDataApi({
        invoice_no: CurrentBillNo,
        type: 1,
      });
      console.log(response.data.data.payload);
      setCurrentInvoiceData(response.data.data.payload);
    } catch (err) {
      console.log(err);
    }
    setFetchingLoading(false);
  };

  useEffect(() => {
    if (CurrentBillNo !== "") {
      GetInvoiceData();
    }
  }, [CurrentBillNo]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

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

      {FetchingLoading ? (
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
          <div
            className="flex w-full gap-x-7 px-3 pt-3"
            style={{ borderColor: "#002650", borderWidth: "2px 2px 0px 2px" }}
          >
            <div className="flex flex-col gap-y-3 w-[50%]">
              <div className="flex items-center gap-x-2">
                <div className="font-semibold text-lg underline">Name:</div>
                <div className="font-semibold text-lg">
                  {CurrentInvoiceData.Invoice_Info &&
                    CurrentInvoiceData.Invoice_Info.customerId.name}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="font-semibold text-lg underline">
                  Contact #:
                </div>
                <div className="font-semibold text-lg">
                  {CurrentInvoiceData.Invoice_Info &&
                    CurrentInvoiceData.Invoice_Info.customerId.contact}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-3 w-[50%]">
              <div className="flex items-center gap-x-2">
                <div className="font-semibold text-lg underline">
                  Invoice #:
                </div>
                <div className="font-semibold text-lg">
                  {CurrentInvoiceData.Invoice_Info &&
                    CurrentInvoiceData.Invoice_Info.invoice_no}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="font-semibold text-lg underline">Date:</div>
                <div className="font-semibold text-lg">
                  {moment(
                    new Date(
                      CurrentInvoiceData.Invoice_Info &&
                        CurrentInvoiceData.Invoice_Info.date * 1000
                    )
                  ).format("DD/MM/YYYY")}
                </div>
              </div>
              {/* <div className="flex items-start justify-center gap-x-2">
              <div className="font-bold text-xl underline">Address:</div>
              <div className="font-bold text-xl">
                {CurrentInvoiceData.Invoice_Info.customerId.address}
              </div>
            </div> */}
            </div>
          </div>
          <div
            className="flex items-start justify-start gap-x-2 pt-3 px-3 pb-3"
            style={{
              borderColor: "#002650",
              borderWidth: "0px 2px 2px 2px",
              borderRadius: "0px 0px 10px 10px",
            }}
          >
            <div className="font-semibold text-lg underline">Address:</div>
            <div className="font-semibold text-lg">
              {CurrentInvoiceData.Invoice_Info &&
                CurrentInvoiceData.Invoice_Info.customerId.address}
            </div>
          </div>
          {CurrentInvoiceData?.Invoice_Info?.items && (
            <div className="flex w-full">
              <PrintSimpleTable
                rows={CurrentInvoiceData.Invoice_Info.items}
                columns={BillItemColumns}
                bgColor={"#002650"}
              />
            </div>
          )}
          <div className="flex flex-col w-full justify-end items-end px-3 py-3 gap-y-3">
            <div className="font-bold">
              Discount:{" "}
              {Number(
                CurrentInvoiceData?.Invoice_Info?.discount
              ).toLocaleString()}
              /-
            </div>
            <div className="font-bold">
              Total:{" "}
              {Number(
                CurrentInvoiceData?.Invoice_Info?.total_amount
              ).toLocaleString()}
              /-
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBillInvoice;
