import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CompanyNav from "../../components/Navigations/CompanyNav";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import SearchableTable from "../../components/Tables/SearchableTable";
import EditCompany from "../../components/Modals/EditCompany";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteCompanyApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";

const Info = () => {
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
          Columns={CompanyColumns}
        />
        {OpenEditModal && (
          <EditCompany
            open={OpenEditModal}
            setOpen={setOpenEditModal}
            CurrentCompany={CompanyState.data.find(
              (dt) => dt._id === Selected._id
            )}
          />
        )}

        {OpenDeleteModal && (
          <DeleteModal
            Open={OpenDeleteModal}
            setOpen={setOpenDeleteModal}
            onSubmit={async () => {
              setLoading(true);
              try {
                const response = await DeleteCompanyApi({
                  companyId: CustomerID,
                });
                if (response.data.success) {
                  SuccessToast(response.data.data.msg);
                  setOpenDeleteModal(false);
                  dispatch(fetchCustomers());
                }
              } catch (err) {
                console.log(err);
              }
              setLoading(false);
            }}
            Loading={Loading}
          />
        )}
      </div>
    </div>
  );
};

export default Info;
