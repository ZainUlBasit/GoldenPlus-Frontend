import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ItemsNav from "../../components/Navigations/ItemsNav";
import SearchableTable from "../../components/Tables/SearchableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyItemLedger } from "../../store/Slices/CompanyItemLegderSlice";
import { StockStatsColumns } from "../../utils/ColumnsData/StockStatsColumns";
import exportToExcel from "../../utils/ExportToExcel";
import EditStockModal from "../../components/Modals/EditStockModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteStockStatsApi } from "../../Https";
import { SuccessToast } from "../../utils/ShowToast";

const StockStats = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState(false);

  const CompanyItemLegderState = useSelector(
    (state) => state.CompanyItemLegderState
  );
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchCompanyItemLedger({
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
        startDate: 0,
        endDate: Math.floor(new Date() / 1000),
      })
    );
  }, []);

  return (
    <div className="relative">
      <Navbar />
      <ItemsNav />
      <div className="flex justify-end px-4 py-4">
        <div
          className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            exportToExcel(
              CompanyItemLegderState.data.filter((dt) =>
                SearchText === ""
                  ? true
                  : Number(SearchText) === Number(dt.article_name)
              ),
              "Stock Statistics"
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
          SearchPlaceholder={"Search Article..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={
            CompanyItemLegderState.data &&
            CompanyItemLegderState.data
              .filter((dt) =>
                SearchText === ""
                  ? true
                  : dt.article_name
                      .toLowerCase()
                      .includes(SearchText.toLowerCase())
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))
          }
          Columns={StockStatsColumns}
        />

        {OpenEditModal && (
          <EditStockModal
            OpenModal={OpenEditModal}
            setOpenModal={setOpenEditModal}
            CurrentState={Selected}
          />
        )}

        {OpenDeleteModal && (
          <DeleteModal
            Open={OpenDeleteModal}
            setOpen={setOpenDeleteModal}
            onSubmit={async () => {
              setLoading(true);
              try {
                const response = await DeleteStockStatsApi(Selected._id);
                if (response.data.success) {
                  SuccessToast(response.data.data.msg);
                  setOpenDeleteModal(false);
                  dispatch(
                    fetchCompanyItemLedger({
                      branchId:
                        AuthState.data.role === 2
                          ? AuthState.data.branchId._id
                          : "",
                      startDate: 0,
                      endDate: Math.floor(new Date() / 1000),
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

export default StockStats;
