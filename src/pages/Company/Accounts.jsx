import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CompanyNav from "../../components/Navigations/CompanyNav";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import SearchableTable from "../../components/Tables/SearchableTable";
import { CompanyAccountsColumns } from "../../utils/ColumnsData/CompanyAccountsColumns";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import exportToExcel from "../../utils/ExportToExcel";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const CompanyState = useSelector((state) => state.CompanyState);
  const AuthState = useSelector((state) => state.AuthState);
  const navigate = useNavigate();

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

  const totalAmount = useMemo(() => {
    return CompanyState.data
      .filter(
        (dt) =>
          SearchText === "" ||
          dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
      )
      .reduce((acc, cust) => acc + cust.total, 0);
  }, [CompanyState.data, SearchText]);
  const openingBalance = useMemo(() => {
    return CompanyState.data
      .filter(
        (dt) =>
          SearchText === "" ||
          dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
      )
      .reduce((acc, cust) => acc + cust.opening_balance, 0);
  }, [CompanyState.data, SearchText]);
  const recievedAmount = useMemo(() => {
    return CompanyState.data
      .filter(
        (dt) =>
          SearchText === "" ||
          dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
      )
      .reduce((acc, cust) => acc + cust.paid, 0);
  }, [CompanyState.data, SearchText]);
  const recievealeAmount = useMemo(() => {
    return CompanyState.data
      .filter(
        (dt) =>
          SearchText === "" ||
          dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
      )
      .reduce((acc, cust) => acc + cust.remaining, 0);
  }, [CompanyState.data, SearchText]);

  return (
    <div className="relative">
      <Navbar />
      <CompanyNav />
      <div className="w-full flex justify-end px-2 py-3">
        <div
          className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            exportToExcel(
              CompanyState.data.filter((dt) =>
                SearchText === ""
                  ? true
                  : dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
              ),
              "MyExcelFile"
            );
          }}
        >
          Convert to Excel
        </div>
      </div>
      <div className="w-full mt-2 flex justify-center items-center">
        <SearchableTable
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelected={setSelected}
          SearchPlaceholder={"Search Supplier..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={CompanyState.data.filter((dt) =>
            SearchText === ""
              ? true
              : dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
          )}
          Columns={CompanyAccountsColumns}
        />
      </div>
      <div className="flex justify-center items-center mt-1">
        <div className="flex gap-x-2 my-5">
          <div
            className="px-2 py-2 border-2 border-black hover:rounded-lg transition-all ease-in-out duration-500 hover:bg-gray-600 bg-black text-white hover:text-white cursor-pointer w-[200px] flex justify-center items-center font-bold"
            onClick={() => {
              navigate("/company-report");
            }}
          >
            Print Item Ledger
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full flex-col">
        <div className="flex gap-x-1 font-bold text-xl">
          <div className="">Total Amount:</div>
          <div className="">{Number(totalAmount).toLocaleString()} /-</div>
        </div>
        <div className="flex gap-x-1 font-bold text-xl">
          <div className="">Opening Balance:</div>
          <div className="">{Number(openingBalance).toLocaleString()} /-</div>
        </div>
        <div className="flex gap-x-1 font-bold text-xl">
          <div className="">Paid:</div>
          <div className="">{Number(recievedAmount).toLocaleString()} /-</div>
        </div>
        <div className="flex gap-x-1 font-bold text-xl">
          <div className="">Payable:</div>
          <div className="">{Number(recievealeAmount).toLocaleString()} /-</div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
