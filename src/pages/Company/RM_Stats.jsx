import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CompanyNav from "../../components/Navigations/CompanyNav";
import { CompanyColumns } from "../../utils/ColumnsData/CompanyColumns";
import SearchableTable from "../../components/Tables/SearchableTable";
import EditCompany from "../../components/Modals/EditCompany";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteCompanyApi, Delete_RM_StatsApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { fetchRMStats } from "../../store/Slices/RMStatsSlice";
import { RM_Stat_Columns } from "../../utils/ColumnsData/RM_Stat_Columns";
import UpdateRMStockModal from "../../components/Modals/UpdateRMStockModal";

const RM_Stats = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState("");

  const RMStatsState = useSelector((state) => state.RMStatsState);
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchRMStats({
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
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
          CurrentData={RMStatsState.data.filter((dt) =>
            SearchText === ""
              ? true
              : dt.supplier_name
                  .toLowerCase()
                  .startsWith(SearchText.toLowerCase())
          )}
          Columns={RM_Stat_Columns}
        />
        {OpenEditModal && (
          <UpdateRMStockModal
            OpenModal={OpenEditModal}
            setOpenModal={setOpenEditModal}
            itemData={RMStatsState.data.find((dt) => dt._id === Selected._id)}
          />
        )}

        {OpenDeleteModal && (
          <DeleteModal
            Open={OpenDeleteModal}
            setOpen={setOpenDeleteModal}
            onSubmit={async () => {
              setLoading(true);
              try {
                const response = await Delete_RM_StatsApi({
                  id: Selected._id,
                });
                if (response.data.success) {
                  SuccessToast(response.data.data.msg);
                  setOpenDeleteModal(false);
                  dispatch(
                    fetchRMStats({
                      branchId:
                        AuthState.data.role === 2
                          ? AuthState.data.branchId._id
                          : "",
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

export default RM_Stats;
