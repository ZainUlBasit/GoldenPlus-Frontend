import React from "react";
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
