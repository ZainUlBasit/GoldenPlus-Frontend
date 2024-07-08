import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import CustomPopOver from "../Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import ProcessLoader from "../Loader/ProcessLoader";
import ModalWrapper from "./ModalWrapper";
import CustomInput from "../Inputs/CustomInput";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import { ErrorToast, SuccessToast } from "../../utils/ShowToast";
import { UpdateItemApi } from "../../Https"; // Replace CreateItemApi with UpdateItemApi
import { fetchItems } from "../../store/Slices/ItemSlice";

const EditItemModal = ({ openModal, setOpenModal, itemData }) => {
  console.log(itemData);
  const [formData, setFormData] = useState({
    size: itemData.size || "",
    branchId: itemData.branchId || "",
    articleId: itemData.articleId._id || "",
    branch_name: itemData.branch_name || "",
    article_name: itemData.article_name || "",
    branch: itemData.branch || "",
    purchase: itemData.purchase || 0,
    sale: itemData.sale || 0,
  });
  const [Loading, setLoading] = useState(false);

  const CompanyState = useSelector((state) => state.CompanyState);
  const ArticleState = useSelector((state) => state.ArticleState);
  const AuthState = useSelector((state) => state.AuthState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchCompanies({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
    dispatch(
      fetchArticles(
        AuthState.data.role === 2 ? AuthState.data.branchId.branch_number : -1
      )
    );
  }, [dispatch, AuthState.data.role, AuthState.data.branchId]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    const { size, articleId, purchase, sale } = formData;
    if (!size || !articleId || purchase === undefined || sale === undefined) {
      ErrorToast("Required fields are undefined!");
    } else {
      try {
        const response = await UpdateItemApi({
          itemId: itemData._id,
          ...formData,
          branch:
            AuthState.data.role === 2
              ? AuthState.data.branchId.branch_number
              : -1,
          branch_name:
            AuthState.data.role === 2 ? AuthState.data.branchId.name : "",
          branchId:
            AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
          article_name: ArticleState.data.find(
            (dt) => dt._id === formData.articleId
          ).name,
        });
        if (response.data.success) {
          SuccessToast(response.data.message);
          dispatch(
            fetchItems({
              branch:
                AuthState.data.role === 2
                  ? AuthState.data.branchId.branch_number
                  : -1,
            })
          );
          setOpenModal(false);
        } else {
          ErrorToast("Unable to update the item");
        }
      } catch (err) {
        ErrorToast(err.response.data.error.msg);
      }
    }
    setLoading(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const [anchorElArticle, setAnchorElArticle] = useState(null);

  const handleClickArticle = (event) => {
    setAnchorElArticle(event.currentTarget);
  };

  const handleCloseArticle = () => {
    setAnchorElArticle(null);
  };

  const openPopoverArticle = Boolean(anchorElArticle);
  const idArticle = openPopoverArticle ? "simple-popover" : undefined;

  return (
    <ModalWrapper open={openModal} setOpen={setOpenModal} title={"Edit Item"}>
      <div className="flex justify-center flex-col py-5 gap-y-3">
        <CustomPopOver
          label={"Select Article"}
          placeholder={"Select Article"}
          required={false}
          Value={
            formData.articleId
              ? ArticleState.data.find((dt) => dt._id === formData.articleId)
                  ?.name
              : "Select Article"
          }
          onClick={(e) => handleClickArticle(e)}
        />

        <Popover
          id={idArticle}
          open={openPopoverArticle}
          anchorEl={anchorElArticle}
          onClose={handleCloseArticle}
          PaperProps={{
            sx: {
              borderRadius: "25px",
              backgroundColor: "white",
              width: "300px",
              overflow: "hidden",
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Typography
            sx={{
              p: 2,
              borderColor: "#000",
              backgroundColor: "#000",
              width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                {ArticleState.data &&
                  ArticleState.data
                    .filter((dt) => dt.company_id === formData.companyId)
                    .map((dt) => (
                      <div
                        key={dt._id}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleCloseArticle();
                          handleChange("articleId", dt._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={formData.articleId === dt._id}
                          readOnly
                        />
                        <span>{dt.name}</span>
                      </div>
                    ))}
              </div>
            </div>
          </Typography>
        </Popover>
        <CustomInput
          id="size"
          Type="text"
          label="Size"
          placeholder="Enter Item Size"
          Value={formData.size}
          setValue={(value) => handleChange("size", value)}
          required
        />
        <CustomInput
          id="Purchase"
          Type="number"
          label="Purchase"
          placeholder="Enter Purchase rate"
          Value={formData.purchase}
          setValue={(value) => handleChange("purchase", value)}
          required
        />
        <CustomInput
          id="Sale"
          Type="number"
          label="Sale"
          placeholder="Enter Sale rate"
          Value={formData.sale}
          setValue={(value) => handleChange("sale", value)}
          required
        />
        <div className="w-full flex justify-center mt-5">
          {Loading ? (
            <ProcessLoader />
          ) : (
            <button
              onClick={handleSubmit}
              className="w-[80%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
            >
              Update Item
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditItemModal;
