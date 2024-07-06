import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import BranchNavData from "../../utils/BranchNavData";
import BranchNav from "../../components/Navigations/BranchNav";
import { fetchBranches } from "../../store/Slices/BranchSlice";
import SearchableTable from "../../components/Tables/SearchableTable";
import { CustomerColumns } from "../../utils/ColumnsData/CustomerColumns";
import { BranchColumns } from "../../utils/ColumnsData/BranchColumns";
import EditBranchModal from "../../components/Modals/EditBranchModal";

const BranchesInfo = () => {
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState(false);

  const BranchState = useSelector((state) => state.BranchState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBranches());
  }, []);
  return (
    <div className="relative">
      <Navbar />
      <BranchNav />
      <div className="w-full mt-2 flex justify-center items-center">
        <SearchableTable
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          setSelected={setSelected}
          SearchPlaceholder={"Search Branch Name..."}
          SearchText={SearchText}
          setSearchText={setSearchText}
          CurrentData={BranchState.data.filter((dt) =>
            SearchText === ""
              ? true
              : dt.name.toLowerCase().startsWith(SearchText.toLowerCase())
          )}
          Columns={BranchColumns}
        />
        {OpenEditModal && (
          <EditBranchModal
            OpenModal={OpenEditModal}
            setOpenModal={setOpenEditModal}
            branch={BranchState.data.find((dt) => dt._id === Selected._id)}
          />
        )}
      </div>
    </div>
  );
};

export default BranchesInfo;
