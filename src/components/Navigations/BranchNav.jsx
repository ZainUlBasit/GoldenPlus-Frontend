import React, { useState } from "react";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import CustomerNavData from "../../utils/CustomerNavData";
import CreateCustomerModal from "../Modals/CreateCustomer";
import { useNavigate } from "react-router-dom";
import BranchNavData from "../../utils/BranchNavData";
import CreateBranchModal from "../Modals/CreateBranch";

const BranchNav = () => {
  const [OpenModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  return (
    <NavigationsWrapper>
      {BranchNavData.map((nd) => {
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
                if (nd.title === "Create Branch") {
                  setOpenModal(true);
                }
              }
            }}
          />
        );
      })}
      {OpenModal && (
        <CreateBranchModal OpenModal={OpenModal} setOpenModal={setOpenModal} />
      )}
    </NavigationsWrapper>
  );
};

export default BranchNav;
