import React, { useState } from "react";
import CompanyNavData from "../../utils/CompanyNavData";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import { useNavigate } from "react-router-dom";
import CreateCompany from "../Modals/CreateCompany";
import { RiSecurePaymentFill } from "react-icons/ri";
import PaymentModal from "../Modals/PaymentModal";

const CashPaymentNav = () => {
  const [OpenAddModal, setOpenAddModal] = useState(false);
  return (
    <NavigationsWrapper>
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
      {OpenAddModal && (
        <PaymentModal OpenModal={OpenAddModal} setOpenModal={setOpenAddModal} />
      )}
    </NavigationsWrapper>
  );
};

export default CashPaymentNav;
