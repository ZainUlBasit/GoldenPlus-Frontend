import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CustomerNav from "../../components/Navigations/CustomerNav";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import SearchableTable from "../../components/Tables/SearchableTable";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import { CustomerColumns } from "../../utils/ColumnsData/CustomerColumns";
import EditCustomerModal from "../../components/Modals/EditCustomerModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteCustomerApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";

const Info = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState(false);

  const CustomerState = useSelector((state) => state.CustomerState);
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
  }, []);
  return (
    <div className="relative">
      <Navbar />
      <CustomerNav />
      <div className="w-full mt-2 flex justify-center items-center">
        <SearchableTable
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelected={setSelected}
          SearchPlaceholder={"Search Customer..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={CustomerState.data.filter((dt) =>
            SearchText === ""
              ? true
              : dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
          )}
          Columns={CustomerColumns}
        />
        {OpenEditModal && (
          <EditCustomerModal
            OpenModal={OpenEditModal}
            setOpenModal={setOpenEditModal}
            customer={CustomerState.data.find((dt) => dt._id === Selected._id)}
          />
        )}

        {OpenDeleteModal && (
          <DeleteModal
            Open={OpenDeleteModal}
            setOpen={setOpenDeleteModal}
            onSubmit={async () => {
              setLoading(true);
              try {
                const response = await DeleteCustomerApi(Selected._id);
                if (response.data.success) {
                  SuccessToast(response.data.data.msg);
                  setOpenDeleteModal(false);
                  dispatch(
                    fetchCustomers({
                      branch: 1,
                    })
                  );
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
