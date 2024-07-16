import React, { useState } from "react";
import CompanyNavData from "../../utils/CompanyNavData";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import { useNavigate } from "react-router-dom";
import CreateCompany from "../Modals/CreateCompany";
import { RiSecurePaymentFill } from "react-icons/ri";
import PaymentModal from "../Modals/PaymentModal";
import { BiInfoCircle } from "react-icons/bi";

const CashPaymentNav = () => {
  const [OpenAddModal, setOpenAddModal] = useState(false);
  const navigate = useNavigate();
  return (
    <NavigationsWrapper>
      <NavBtn
        title={"Payment Info"}
        Icon={BiInfoCircle}
        Type={"link"}
        link={"/cash-payments"}
        Width={"w-[230px]"}
        onClick={() => {
          navigate("/cash-payments");
        }}
      />
      <NavBtn
        title={"New Payment"}
        Icon={RiSecurePaymentFill}
        Type={"modal"}
        link={"/"}
        Width={"w-[230px]"}
        onClick={() => {
          setOpenAddModal(true);
        }}
      />
      <NavBtn
        title={"Cash Summary"}
        Icon={RiSecurePaymentFill}
        Type={"modal"}
        link={"/"}
        Width={"w-[230px]"}
        onClick={() => {
          navigate("/cash-summary");
        }}
      />
      {OpenAddModal && (
        <PaymentModal OpenModal={OpenAddModal} setOpenModal={setOpenAddModal} />
      )}
    </NavigationsWrapper>
  );
};

export default CashPaymentNav;
