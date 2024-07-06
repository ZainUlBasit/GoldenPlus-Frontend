import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ItemsNav from "../../components/Navigations/ItemsNav";
import SearchableTable from "../../components/Tables/SearchableTable";
import { ItemColumns } from "../../utils/ColumnsData/ItemColumns";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../../store/Slices/ItemSlice";
import EditItemModal from "../../components/Modals/EditItemModal";

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

  return (
    <div className="relative">
      <Navbar />
      <ItemsNav />
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
