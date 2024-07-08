import React, { useState } from "react";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import CustomerNavData from "../../utils/CustomerNavData";
import CreateCustomerModal from "../Modals/CreateCustomer";
import { useNavigate } from "react-router-dom";
import AddOpenBalanceCustomer from "../Modals/AddOpenBalanceCustomer";

const CustomerNav = () => {
  const [OpenModal, setOpenModal] = useState(false);
  const [OpenModalOpeningBalance, setOpenModalOpeningBalance] = useState(false);
  const navigate = useNavigate();
  return (
    <NavigationsWrapper>
      {CustomerNavData.map((nd) => {
        return (
          <NavBtn
            title={nd.title}
            Icon={nd.icon}
            Type={nd.type}
            link={nd.link}
            Width={
              nd.title === "Add Opening Balance" ? "w-[270px]" : "w-[230px]"
            }
            onClick={() => {
              if (nd.type === "link") navigate(nd.link);
              else {
                if (nd.title === "Create New") {
                  setOpenModal(true);
                } else if (nd.title === "Add Opening Balance") {
                  setOpenModalOpeningBalance(true);
                }
              }
            }}
          />
        );
      })}
      {OpenModal && (
        <CreateCustomerModal
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
        />
      )}
      {OpenModalOpeningBalance && (
        <AddOpenBalanceCustomer
          OpenModal={OpenModalOpeningBalance}
          setOpenModal={setOpenModalOpeningBalance}
        />
      )}
    </NavigationsWrapper>
  );
};

export default CustomerNav;
