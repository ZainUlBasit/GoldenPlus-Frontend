import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CashPaymentNav from "../../components/Navigations/CashPaymentNav";
import SimpleTable from "../../components/Tables/SimpleTable";
import {
  CashSummaryColumns,
  CustomerItemLedgerColumns,
} from "../../utils/ColumnsData/ItemLedgerColumns";
import AddAccountModal from "../../components/Modals/AddAccountModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "../../store/Slices/AccountsStatSlice";
import { fetchAccountsAmount } from "../../store/Slices/AccountSlice";
import AddAmountModal from "../../components/Modals/AddAmountModal";

const Summary = () => {
  const [OpenTypeModal, setOpenTypeModal] = useState(false);
  const [UpdateAmountModal, setUpdateAmountModal] = useState("");
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);
  const AccountState = useSelector((state) => state.AccountState);

  useEffect(() => {
    dispatch(
      fetchAccountsAmount({
        branchId: AuthState.data.role === 2 ? AuthState.data.branchId : -1,
      })
    );
  }, []);
  return (
    <div className="relative">
      <Navbar />
      <CashPaymentNav />
      <div className="flex justify-center items-center gap-x-3 gap-y-3 mb-4">
        <div
          className="bg-[#464F51] border-2 border-[#464F51] hover:bg-[#464f51c7] text-white px-3 py-3 text-xl font-bold hover:rounded-[10px] transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            setOpenTypeModal(true);
          }}
        >
          Add Account Name
        </div>
        <div
          className="bg-[#464F51] border-2 border-[#464F51] hover:bg-[#464f51c7] text-white px-3 py-3 text-xl font-bold hover:rounded-[10px] transition-all ease-in-out duration-500 cursor-pointer"
          onClick={() => {
            setUpdateAmountModal(true);
          }}
        >
          Add Amount
        </div>
      </div>
      <div
        className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
        onClick={() => {
          exportToExcel(AccountState.data, "Stock Statistics");
        }}
      >
        Convert to Excel
      </div>
      <div className="">
        <SimpleTable
          columns={CashSummaryColumns}
          title={"Cash Summary"}
          rows={AccountState.data}
        />
      </div>
      {OpenTypeModal && (
        <AddAccountModal
          OpenModal={OpenTypeModal}
          setOpenModal={setOpenTypeModal}
        />
      )}
      {UpdateAmountModal && (
        <AddAmountModal
          OpenModal={UpdateAmountModal}
          setOpenModal={setUpdateAmountModal}
        />
      )}
    </div>
  );
};

export default Summary;
