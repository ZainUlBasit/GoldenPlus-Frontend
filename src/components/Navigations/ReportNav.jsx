import React, { useState } from "react";
import ItemNavData from "../../utils/ItemNavData";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import CreateItemModal from "../Modals/CreateItemModal";
import CreateArticleModal from "../Modals/CreateArticleModal";
import EditArticleModal from "../Modals/EditArticleModal";
import AddStockModal from "../Modals/AddStockModal";
import { useNavigate } from "react-router-dom";
import ReportNavData from "../../utils/ReportNavData";
import CreateExpenseModal from "../Modals/CreateExpenseModal";

const ReportNav = () => {
  const [OpenExpenseModal, setOpenExpenseModal] = useState(false);
  const navigate = useNavigate();
  return (
    <NavigationsWrapper>
      {ReportNavData.map((nd) => {
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
                setOpenExpenseModal(true);
              }
            }}
          />
        );
      })}

      {OpenExpenseModal && (
        <CreateExpenseModal
          OpenModal={OpenExpenseModal}
          setOpenModal={setOpenExpenseModal}
        />
      )}
    </NavigationsWrapper>
  );
};

export default ReportNav;
