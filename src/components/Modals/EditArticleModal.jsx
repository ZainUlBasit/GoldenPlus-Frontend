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
// import { UpdateArticleApi } from "../../Https"; // Assuming there's an update API for articles
import { fetchItems } from "../../store/Slices/ItemSlice";
import { UpdateArticleApi } from "../../Https";

const EditArticleModal = ({ openModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    article_id: "",
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
  }, [dispatch]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    const { name } = formData;
    if (!name) {
      // One or more fields are empty
      ErrorToast("Required fields are undefined!");
    } else {
      try {
        const response = await UpdateArticleApi({
          articleId: formData.article_id,
          newName: formData.name,
        });
        if (response.data.success) {
          SuccessToast(response.data.message);
          dispatch(fetchItems({ branch: 1 })); // Ensure you have a function to fetch items
          setOpenModal(false);
        } else {
          ErrorToast("Unable to update the article");
        }
      } catch (err) {
        ErrorToast(err.response.data.error.msg);
        // console.log(err);
      }
    }
    setLoading(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElArticle, setAnchorElArticle] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickArticle = (event) => {
    setAnchorElArticle(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseArticle = () => {
    setAnchorElArticle(null);
  };

  const openPopover = Boolean(anchorEl);
  const openPopoverArticle = Boolean(anchorElArticle);
  const id = openPopover ? "simple-popover" : undefined;
  const idArticle = openPopoverArticle ? "simple-popover-article" : undefined;

  return (
    <ModalWrapper
      open={openModal}
      setOpen={setOpenModal}
      title={"Edit Article"}
    >
      <div className="flex justify-center flex-col py-5 gap-y-4">
        <CustomPopOver
          label={"Select Article"}
          placeholder={"Select Article"}
          required={false}
          Value={
            formData.article_id
              ? ArticleState.data.find((dt) => dt._id === formData.article_id)
                  ?.name || "Select Article"
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
                  ArticleState.data.map((dt) => (
                    <div
                      key={dt._id}
                      className="flex gap-x-3 items-center cursor-pointer"
                      onClick={() => {
                        handleCloseArticle();
                        handleChange("article_id", dt._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                        checked={formData.article_id === dt._id}
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
          id="article"
          Type="text"
          label="Enter New Name"
          placeholder="Enter New Name"
          Value={formData.name}
          setValue={(value) => handleChange("name", value)}
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
              Update Article
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditArticleModal;
