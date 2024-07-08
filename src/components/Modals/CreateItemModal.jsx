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
import { CreateItemApi } from "../../Https";
import { fetchItems } from "../../store/Slices/ItemSlice";
import SearchBox from "../SearhBox/SearchBox";

const CreateItemModal = ({ openModal, setOpenModal }) => {
  const [formData, setFormData] = useState({
    size: "",
    branchId: "",
    articleId: "",
    branch_name: "",
    article_name: "",
    branch: "",
    purchase: "",
    sale: "",
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
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    const { size, articleId, purchase, sale } = formData;
    if (!size || !articleId || !purchase || !sale) {
      // One or more fields are empty
      ErrorToast("Required fields are undefined!");
    } else {
      try {
        // console.log(AuthState.data);
        const response = await CreateItemApi({
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
          ); // Ensure you have a function to fetch customer data
          setOpenModal(false);
        } else {
          ErrorToast("Unable to add new article");
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

  const [SearchText, setSearchText] = useState("");

  return (
    <ModalWrapper open={openModal} setOpen={setOpenModal} title={"Create Item"}>
      <div className="flex justify-center flex-col py-5 gap-y-3">
        <CustomPopOver
          label={"Select Article"}
          placeholder={"Select Article"}
          required={false}
          Value={
            formData.articleId
              ? ArticleState.data.find((dt) => dt._id === formData.articleId)
                  .name
              : "Select Article"
          }
          onClick={(e) => handleClickArticle(e)}
        />
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={() => handleClose()}
          PaperProps={{
            sx: {
              borderRadius: "25px", // Add rounded corners
              backgroundColor: "white", // Set background color to white
              // width: "300px", // Set the width as needed
              overflow: "hidden", // Hide overflowing content
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
              // width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
              overflowY: "auto",
              height: "60vh",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                <SearchBox
                  Value={SearchText}
                  SetValue={setSearchText}
                  Placeholder={"Search Company"}
                />
                {CompanyState.data &&
                  CompanyState.data
                    .filter((dt) => {
                      const lowerCaseSearch = SearchText.toLowerCase();
                      const lowerCaseStation = dt.name.toLowerCase();
                      if (SearchText !== "") {
                        return lowerCaseStation.includes(lowerCaseSearch);
                      } else {
                        return dt;
                      }
                    })
                    .map((dt) => (
                      <div
                        key={dt._id}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleClose();
                          handleChange("companyId", dt._id);
                          // setCompanyId(dt._id);
                          // setCompany(dt.name);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={formData.companyId === dt._id}
                          readOnly
                        />
                        <span>{dt.name}</span>
                      </div>
                    ))}
              </div>
            </div>
          </Typography>
        </Popover>
        <Popover
          id={idArticle}
          open={openPopoverArticle}
          anchorEl={anchorElArticle}
          onClose={() => handleCloseArticle()}
          PaperProps={{
            sx: {
              borderRadius: "25px", // Add rounded corners
              backgroundColor: "white", // Set background color to white
              // width: "300px", // Set the width as needed
              overflow: "hidden", // Hide overflowing content
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
              // width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                <SearchBox
                  Value={SearchText}
                  SetValue={setSearchText}
                  Placeholder={"Search Article"}
                />
                {ArticleState.data &&
                  ArticleState.data
                    .filter((dt) => {
                      const lowerCaseSearch = SearchText.toLowerCase();
                      const lowerCaseStation = dt.name.toLowerCase();
                      if (SearchText !== "") {
                        return lowerCaseStation.includes(lowerCaseSearch);
                      } else {
                        return dt;
                      }
                    })
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
        {/* <CustomInput
          id="desc"
          Type="text"
          label="Desc"
          placeholder="Enter Description"
          Value={formData.desc}
          setValue={(value) => handleChange("desc", value)}
          required
        /> */}
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
              Create Item
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateItemModal;
