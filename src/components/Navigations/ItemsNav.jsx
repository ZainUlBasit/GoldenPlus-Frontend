import React, { useState } from "react";
import ItemNavData from "../../utils/ItemNavData";
import NavBtn from "../Buttons/NavBtn";
import NavigationsWrapper from "./NavigationsWrapper";
import CreateItemModal from "../Modals/CreateItemModal";
import CreateArticleModal from "../Modals/CreateArticleModal";
import EditArticleModal from "../Modals/EditArticleModal";
import AddStockModal from "../Modals/AddStockModal";
import { useNavigate } from "react-router-dom";

const ItemsNav = () => {
  const [AddArticleModal, setAddArticleModal] = useState(false);
  const [OpenEditArticleModal, setOpenEditArticleModal] = useState(false);
  const [AddNewItemModal, setAddNewItemModal] = useState(false);
  const [OpenAddStockModal, setOpenAddStockModal] = useState(false);
  const navigate = useNavigate();
  return (
    <NavigationsWrapper>
      {ItemNavData.map((nd) => {
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
                if (nd.title === "Add Article") {
                  setAddArticleModal(true);
                } else if (nd.title === "Edit Article") {
                  setOpenEditArticleModal(true);
                } else if (nd.title === "Create Item") {
                  setAddNewItemModal(true);
                } else if (nd.title === "Add Stock") {
                  setOpenAddStockModal(true);
                }
              }
            }}
          />
        );
      })}
      {AddNewItemModal && (
        <CreateItemModal
          openModal={AddNewItemModal}
          setOpenModal={setAddNewItemModal}
        />
      )}
      {AddArticleModal && (
        <CreateArticleModal
          openModal={AddArticleModal}
          setOpenModal={setAddArticleModal}
        />
      )}
      {OpenEditArticleModal && (
        <EditArticleModal
          openModal={OpenEditArticleModal}
          setOpenModal={setOpenEditArticleModal}
        />
      )}
      {OpenAddStockModal && (
        <AddStockModal
          OpenModal={OpenAddStockModal}
          setOpenModal={setOpenAddStockModal}
        />
      )}
    </NavigationsWrapper>
  );
};

export default ItemsNav;
