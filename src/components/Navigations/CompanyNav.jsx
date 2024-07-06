import React, { useState } from "react";
import CompanyNavData from "../../utils/CompanyNavData";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import { useNavigate } from "react-router-dom";
import CreateCompany from "../Modals/CreateCompany";
import AddRMStockModal from "../Modals/AddRMStockModal";

const CompanyNav = () => {
  const navigate = useNavigate();
  const [OpenAddModal, setOpenAddModal] = useState(false);
  const [OpenAddRawMaterialModal, setOpenAddRawMaterialModal] = useState(false);
  return (
    <NavigationsWrapper>
      {CompanyNavData.map((nd) => {
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
                if (nd.title === "Create Supplier") {
                  setOpenAddModal(true);
                } else if (nd.title === "Add Raw Material") {
                  setOpenAddRawMaterialModal(true);
                }
              }
            }}
          />
        );
      })}
      {OpenAddModal && (
        <CreateCompany Open={OpenAddModal} setOpen={setOpenAddModal} />
      )}
      {OpenAddRawMaterialModal && (
        <AddRMStockModal
          OpenModal={OpenAddRawMaterialModal}
          setOpenModal={setOpenAddRawMaterialModal}
        />
      )}
    </NavigationsWrapper>
  );
};

export default CompanyNav;
