import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import CashPaymentNav from "../../components/Navigations/CashPaymentNav";

const FixedAssets = () => {
  return (
    <div className="relative">
      <Navbar />
      <CashPaymentNav />
      <div>FixedAssets</div>
    </div>
  );
};

export default FixedAssets;
