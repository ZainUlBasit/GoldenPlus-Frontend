import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ItemsNav from "../../components/Navigations/ItemsNav";
import SearchableTable from "../../components/Tables/SearchableTable";
import { ItemColumns } from "../../utils/ColumnsData/ItemColumns";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/Slices/ItemSlice";
import EditItemModal from "../../components/Modals/EditItemModal";
import exportToExcel from "../../utils/ExportToExcel";

const Info = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");

  const ItemState = useSelector((state) => state.ItemState);
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchItems({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, []);

  const totalInQty = useMemo(() => {
    return ItemState.data
      .filter((dt) =>
        SearchText === ""
          ? true
          : Number(dt.article_name) === Number(SearchText)
      )
      .reduce((acc, cust) => acc + cust.in_qty, 0);
  }, [ItemState.data, SearchText]);

  const totalOutQty = useMemo(() => {
    return ItemState.data
      .filter((dt) =>
        SearchText === ""
          ? true
          : Number(dt.article_name) === Number(SearchText)
      )
      .reduce((acc, cust) => acc + cust.out_qty, 0);
  }, [ItemState.data, SearchText]);
  const totalQty = useMemo(() => {
    return ItemState.data
      .filter((dt) =>
        SearchText === ""
          ? true
          : Number(dt.article_name) === Number(SearchText)
      )
      .reduce((acc, cust) => acc + cust.qty, 0);
  }, [ItemState.data, SearchText]);

  return (
    <div className="relative">
      <Navbar />
      <ItemsNav />
      <div className="w-full flex justify-end px-2 py-3">
        <div
          className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            exportToExcel(
              ItemState.data.filter((dt) =>
                SearchText === ""
                  ? true
                  : Number(dt.article_name) === Number(SearchText)
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
          SearchPlaceholder={"Search Article..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={
            ItemState.data &&
            ItemState.data.filter((dt) =>
              SearchText === ""
                ? true
                : Number(dt.article_name) === Number(SearchText)
            )
          }
          Columns={ItemColumns}
        />
      </div>
      <div className="flex justify-center items-center mt-1">
        <div className="flex gap-x-2 my-5">
          <div
            className="px-2 py-2 border-2 border-black hover:rounded-lg transition-all ease-in-out duration-500 hover:bg-gray-600 bg-black text-white hover:text-white cursor-pointer w-[200px] flex justify-center items-center font-bold"
            onClick={() => {
              // navigate("/company-report");
            }}
          >
            Print Info
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="w-[90%] max-w-[1200px] border-[1px] border-[#465462] rounded-[30px] overflow-hidden shadow-[rgba(14,30,37,0.12)_0px_2px_4px_0px,rgba(14,30,37,0.32)_0px_2px_16px_0px] flex justify-center px-5 py-3 mt-4">
          <div className="flex flex-col gap-x-[100px] pr-10 font-[Quicksand]">
            <div>
              Total In-Qty:{" "}
              <span className="font-bold">{Number(totalInQty).toFixed(2)}</span>
            </div>
            <div>
              Total Out-Qty:{" "}
              <span className="font-bold">
                {Number(totalOutQty).toFixed(2)}
              </span>
            </div>
            <div>
              Total Qty:{" "}
              <span className="font-bold">{Number(totalQty).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {OpenEditModal && (
        <EditItemModal
          openModal={OpenEditModal}
          setOpenModal={setOpenEditModal}
          itemData={ItemState.data.find((dt) => dt._id === Selected._id)}
          // itemData={ItemState.data.find((dt) => dt._id === Selected._id)}
        />
      )}
    </div>
  );
};

export default Info;
