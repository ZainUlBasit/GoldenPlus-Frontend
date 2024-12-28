import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ReportNav from "../../components/Navigations/ReportNav";
import ReportCard from "../../components/Cards/ReportCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/Slices/ExpenseSlice";
import moment from "moment";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import SearchableTable from "../../components/Tables/SearchableTable";
import { ExpenseColumns } from "../../utils/ColumnsData/ExpenseColumns";
import EditExpenseModal from "../../components/Modals/EditExpenseModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import { DeleteExpensesApi } from "../../Https";

const ReportInfo = () => {
  const [OpenExpenseReport, setOpenExpenseReport] = useState(false);
  const [fromDate, setFromDate] = useState(
    ""
    // moment(new Date()).format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState("");
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [Selected, setSelected] = useState("");
  const [SearchText, setSearchText] = useState("");
  const [Loading, setLoading] = useState(false);
  const ExpenseState = useSelector((state) => state.ExpenseState);
  const AuthState = useSelector((state) => state.AuthState);
  console.log(AuthState.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchExpenses({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
        fromDate: fromDate,
        toDate: toDate,
      })
    );
  }, [OpenExpenseReport, toDate, fromDate]);
  return (
    <div className="relative">
      <Navbar />
      <ReportNav />
      <div className=" my-2">
        <ReportCard
          title={"Expense Report"}
          setOpenReport={setOpenExpenseReport}
          fromDate={fromDate}
          toDate={toDate}
          setToDate={setToDate}
          setFromDate={setFromDate}
        />
      </div>
      {OpenExpenseReport && ExpenseState.data && (
        <div className="w-full mt-6 flex justify-center items-center">
          <SearchableTable
            setOpenEditModal={setOpenEditModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setSelected={setSelected}
            SearchPlaceholder={"Search Desc..."}
            SearchText={SearchText}
            setSearchText={setSearchText}
            CurrentData={ExpenseState.data.filter((dt) =>
              SearchText === ""
                ? true
                : dt.desc.toLowerCase().startsWith(SearchText.toLowerCase())
            )}
            Columns={ExpenseColumns}
          />
          {OpenEditModal && (
            <EditExpenseModal
              OpenModal={OpenEditModal}
              setOpenModal={setOpenEditModal}
              expense={ExpenseState.data.find((dt) => dt._id === Selected._id)}
              payloadData={{
                branch: AuthState.data.branchId.branch_number,
                fromDate: fromDate,
                toDate: toDate,
              }}
            />
          )}
          {OpenDeleteModal && (
            <DeleteModal
              Open={OpenDeleteModal}
              setOpen={setOpenDeleteModal}
              onSubmit={async () => {
                setLoading(true);
                try {
                  const response = await DeleteExpensesApi(Selected._id);
                  if (response.data.success) {
                    SuccessToast(response.data.data.msg);
                    setOpenDeleteModal(false);
                    dispatch(
                      fetchExpenses({
                        branch:
                          AuthState.data.role === 2
                            ? AuthState.data.branchId.branch_number
                            : -1,
                        fromDate: fromDate,
                        toDate: toDate,
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
      )}
    </div>
  );
};

export default ReportInfo;
