import React, { useState } from "react";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import CustomerNavData from "../../utils/CustomerNavData";
import CreateCustomerModal from "../Modals/CreateCustomer";
import { useNavigate } from "react-router-dom";

const CustomerNav = () => {
  const [OpenModal, setOpenModal] = useState(false);
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
            Width={"w-[230px]"}
            onClick={() => {
              if (nd.type === "link") navigate(nd.link);
              else {
                if (nd.title === "Create New") {
                  setOpenModal(true);
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
    </NavigationsWrapper>
  );
};

export default CustomerNav;
