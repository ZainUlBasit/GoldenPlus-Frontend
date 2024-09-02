import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CashPaymentNav from "../../components/Navigations/CashPaymentNav";
import TableWrapper from "../../components/Tables/TableWrapper";
import Search from "../../components/SearchBox/Search";
import FixedAssetsInfoTable from "../../components/Tables/FixedAssetsInfoTable";

const FixedAssets = () => {
  const [SearchText, setSearchText] = useState("");

  return (
    <div className="relative">
      <Navbar />
      <CashPaymentNav />
      <div className="">
        <div className="bg-[#464F51] border-2 border-[#464F51] hover:bg-[#464f51c7] text-white px-3 py-3 text-xl font-bold hover:rounded-[10px] transition-all ease-in-out duration-500 cursor-pointer">
          Add Fixed Assets
        </div>
        <div className="bg-[#464F51] border-2 border-[#464F51] hover:bg-[#464f51c7] text-white px-3 py-3 text-xl font-bold hover:rounded-[10px] transition-all ease-in-out duration-500 cursor-pointer">
          Add Amount
        </div>
      </div>
      <TableWrapper>
        <Search
          Placeholder={"Search Assets..."}
          Value={SearchText}
          setValue={setSearchText}
        />
        <FixedAssetsInfoTable Rows={[{}]} />
      </TableWrapper>
    </div>
  );
};

export default FixedAssets;
