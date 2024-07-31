import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CompanyNav from "../../components/Navigations/CompanyNav";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import SearchableTable from "../../components/Tables/SearchableTable";
import { CompanyAccountsColumns } from "../../utils/ColumnsData/CompanyAccountsColumns";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import exportToExcel from "../../utils/ExportToExcel";

const Accounts = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const CompanyState = useSelector((state) => state.CompanyState);
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
    </div>
  );
};

export default Accounts;
