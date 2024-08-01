import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import { Typography, Popover } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { SuccessToast, ErrorToast } from "../../utils/ShowToast";
import { UpdateItemQtyApi } from "../../Https";
import { fetchItems } from "../../store/Slices/ItemSlice";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import ProcessLoader from "../Loader/ProcessLoader";
import { fetchCompanyItemLedger } from "../../store/Slices/CompanyItemLegderSlice";
import SearchBox from "../SearhBox/SearchBox";

const AddStockModal = ({ OpenModal, setOpenModal }) => {
  const [CompanyId, setCompanyId] = useState("");
  const [ArticleId, setArticleId] = useState("");
  const [ArticleName, setArticleName] = useState("");
  const [size, setSize] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [NewStock, setNewStock] = useState("");
  const [Purchase, setPurchase] = useState("");
  const [InvoiceNo, setInvoiceNo] = useState("");
  const [TruckNo, setTruckNo] = useState("");
  const [CurrentDate, setDate] = useState("");
  const [Desc, setDesc] = useState("");
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!sizeId || !NewStock || !Purchase || !InvoiceNo || !TruckNo || !Date) {
      ErrorToast("All fields are required");
      setLoading(false);
    } else {
      try {
        const response = await UpdateItemQtyApi({
          articleId: ArticleId,
          article_name: ArticleName,
          size: size,
          sizeId: sizeId,
          qty: Number(NewStock),
          purchase: Number(Purchase),
          invoice_no: InvoiceNo,
          truck_no: TruckNo,
          desc: Desc,
          branchId:
            AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
          branch_name:
            AuthState.data.role === 2 ? AuthState.data.branchId.name : "",
          branch:
            AuthState.data.role === 2
              ? AuthState.data.branchId.branch_number
              : -1,
          date: CurrentDate,
        });
        if (response.data.success) {
          SuccessToast(response.data.data.msg);
          dispatch(
            fetchCompanyItemLedger({
              branchId:
                AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
              startDate: 0,
              endDate: Math.floor(new Date() / 1000),
            })
          );
          dispatch(
            fetchItems({
              branch:
                AuthState.data.role === 2
                  ? AuthState.data.branchId.branch_number
                  : -1,
            })
          );
          setOpenModal(false);
        }
      } catch (err) {
        console.log(err);
        ErrorToast(err.response.data.error.msg);
      }
      setLoading(false);
    }
  };

  const CompanyState = useSelector((state) => state.CompanyState);
  const ArticleState = useSelector((state) => state.ArticleState);
  const ItemState = useSelector((state) => state.ItemState);
  const AuthState = useSelector((state) => state.AuthState);

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
    dispatch(
      fetchItems({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
      })
    );
  }, [dispatch]);

  const [anchorElType, setAnchorElType] = useState(null);
  const [anchorElCompany, setAnchorElCompany] = useState(null);
  const [anchorElArticle, setAnchorElArticle] = useState(null);
  const [anchorElItem, setAnchorElItem] = useState(null);
  const [anchorElSupplier, setAnchorElSupplier] = useState(null);

  const handleClickCompany = (event) => {
    setAnchorElCompany(event.currentTarget);
  };

  const handleClickArticle = (event) => {
    setAnchorElArticle(event.currentTarget);
  };

  const handleClickItem = (event) => {
    setAnchorElItem(event.currentTarget);
  };

  const handleCloseType = () => {
    setAnchorElType(null);
  };
  const handleClickType = (event) => {
    setAnchorElType(event.currentTarget);
  };
  const handleCloseSupplier = () => {
    setAnchorElSupplier(null);
  };
  const handleClickSupplier = (event) => {
    setAnchorElSupplier(event.currentTarget);
  };

  const handleCloseCompany = () => {
    setAnchorElCompany(null);
  };

  const handleCloseArticle = () => {
    setAnchorElArticle(null);
  };

  const handleCloseItem = () => {
    setAnchorElItem(null);
  };

  const openCompany = Boolean(anchorElCompany);
  const openArticle = Boolean(anchorElArticle);
  const idArticle = openArticle ? "simple-popover-article" : undefined;
  const idCompany = openCompany ? "simple-popover-company" : undefined;
  const openSupplier = Boolean(anchorElSupplier);
  const idSupplier = openSupplier ? "simple-popover-Supplier" : undefined;
  const openItem = Boolean(anchorElItem);
  const idItem = openItem ? "simple-popover-item" : undefined;
  const openType = Boolean(anchorElType);
  const idType = openType ? "simple-popover-Type" : undefined;

  const [SearchSize, setSearchSize] = useState("");
  const [SearchArticle, setSearchArticle] = useState("");
  const [AccountType, setAccountType] = useState("");
  const [Supplier, setSupplier] = useState("");

  return (
    <ModalWrapper open={OpenModal} setOpen={setOpenModal} title={"Add Stock"}>
      <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4 py-4">
        <div className="flex flex-col gap-y-4">
          <CustomPopOver
            label={"Select Type"}
            placeholder={"Select Type"}
            required={false}
            Value={AccountType || "Select Type"}
            onClick={handleClickType}
          />
          {AccountType === "Supplier" && (
            <CustomPopOver
              label={"Select Supplier"}
              placeholder={"Select Supplier"}
              required={false}
              Value={
                CompanyState.data.find((dt) => dt._id === Supplier)?.name ||
                "Select Supplier"
              }
              onClick={handleClickSupplier}
            />
          )}
          <CustomPopOver
            label={"Select Article"}
            placeholder={"Select Article"}
            required={false}
            Value={
              ArticleState.data.find((dt) => dt._id === ArticleId)?.name ||
              "Select Article"
            }
            onClick={handleClickArticle}
          />
          <Popover
            id={idSupplier}
            open={openSupplier}
            anchorEl={anchorElSupplier}
            onClose={handleCloseSupplier}
            PaperProps={{
              sx: {
                borderRadius: "25px",
                backgroundColor: "white",
                // width: "300px",
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
                borderColor: "#465462",
                backgroundColor: "#465462",
                // width: "400px",
                overflow: "hidden",
                borderRadius: "25px",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  {CompanyState.data &&
                    CompanyState.data
                      // .filter((dt) => {
                      //   const lowerCaseSearch = SearchArticle.toLowerCase();
                      //   const lowerCaseStation = dt.name.toLowerCase();
                      //   if (SearchArticle !== "") {
                      //     return lowerCaseStation.includes(lowerCaseSearch);
                      //   } else {
                      //     return dt;
                      //   }
                      // })
                      .map((dt) => (
                        <div
                          key={dt._id}
                          className="flex gap-x-3 items-center cursor-pointer"
                          onClick={() => {
                            handleCloseSupplier();
                            setSupplier(dt._id);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                            checked={Supplier === dt._id}
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
            id={idType}
            open={openType}
            anchorEl={anchorElType}
            onClose={handleCloseType}
            PaperProps={{
              sx: {
                borderRadius: "25px",
                backgroundColor: "white",
                // width: "300px",
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
                borderColor: "#465462",
                backgroundColor: "#465462",
                // width: "400px",
                overflow: "hidden",
                borderRadius: "25px",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  {ArticleState.data &&
                    ["Self", "Supplier"]
                      // .filter((dt) => {
                      //   const lowerCaseSearch = SearchArticle.toLowerCase();
                      //   const lowerCaseStation = dt.name.toLowerCase();
                      //   if (SearchArticle !== "") {
                      //     return lowerCaseStation.includes(lowerCaseSearch);
                      //   } else {
                      //     return dt;
                      //   }
                      // })
                      .map((dt) => (
                        <div
                          key={dt}
                          className="flex gap-x-3 items-center cursor-pointer"
                          onClick={() => {
                            handleCloseType();
                            setAccountType(dt);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                            checked={AccountType === dt}
                            readOnly
                          />
                          <span>{dt}</span>
                        </div>
                      ))}
                </div>
              </div>
            </Typography>
          </Popover>
          <Popover
            id={idArticle}
            open={openArticle}
            anchorEl={anchorElArticle}
            onClose={handleCloseArticle}
            PaperProps={{
              sx: {
                borderRadius: "25px",
                backgroundColor: "white",
                // width: "300px",
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
                borderColor: "#465462",
                backgroundColor: "#465462",
                // width: "400px",
                overflow: "hidden",
                borderRadius: "25px",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  <SearchBox
                    Value={SearchArticle}
                    SetValue={setSearchArticle}
                    Placeholder={"Search Article"}
                  />
                  {ArticleState.data &&
                    ArticleState.data
                      .filter((dt) => {
                        const lowerCaseSearch = SearchArticle.toLowerCase();
                        const lowerCaseStation = dt.name.toLowerCase();
                        if (SearchArticle !== "") {
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
                            setArticleId(dt._id);
                            setArticleName(dt.name);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                            checked={ArticleId === dt._id}
                            readOnly
                          />
                          <span>{dt.name}</span>
                        </div>
                      ))}
                </div>
              </div>
            </Typography>
          </Popover>

          <CustomPopOver
            label={"Select Size"}
            placeholder={"Select Size"}
            required={false}
            Value={
              ItemState.data.find((dt) => dt._id === sizeId)?.size ||
              "Select Size"
            }
            onClick={handleClickItem}
          />
          <Popover
            id={idItem}
            open={openItem}
            anchorEl={anchorElItem}
            onClose={handleCloseItem}
            PaperProps={{
              sx: {
                borderRadius: "25px",
                backgroundColor: "white",
                // width: "300px",
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
                borderColor: "#465462",
                backgroundColor: "#465462",
                // width: "400px",
                overflow: "hidden",
                borderRadius: "25px",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  <SearchBox
                    Value={SearchSize}
                    SetValue={setSearchSize}
                    Placeholder={"Search Size"}
                  />
                  {ItemState.data
                    .filter((dt) => {
                      const matchesArticleId = dt.articleId._id === ArticleId;
                      const matchesSearchSize =
                        SearchSize === "" ||
                        dt.size
                          .toLowerCase()
                          .includes(SearchSize.toLowerCase());
                      return matchesArticleId && matchesSearchSize;
                    })
                    .map((dt) => (
                      <div
                        key={dt._id}
                        className="flex gap-x-3 items-center cursor-pointer"
                        onClick={() => {
                          handleCloseItem();
                          setSizeId(dt._id);
                          setSize(dt.size);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                          checked={sizeId === dt._id}
                          readOnly
                        />
                        <span>{dt.size}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Typography>
          </Popover>

          <CustomInput
            id="new-stock"
            Type="number"
            label="Quantity"
            placeholder="Enter Quantity"
            Value={NewStock}
            setValue={setNewStock}
            required
          />
          <CustomInput
            id="desc"
            Type="text"
            label="Description"
            placeholder="Enter Description"
            Value={Desc}
            setValue={setDesc}
            required
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <CustomInput
            id="purchase"
            Type="number"
            label="Purchase"
            placeholder="Enter Purchase"
            Value={Purchase}
            setValue={setPurchase}
            required
          />
          <CustomInput
            id="invoice-no"
            Type="text"
            label="Invoice No"
            placeholder="Enter Invoice No"
            Value={InvoiceNo}
            setValue={setInvoiceNo}
            required
          />

          <CustomInput
            id="truck-no"
            Type="text"
            label="Truck No"
            placeholder="Enter Truck No"
            Value={TruckNo}
            setValue={setTruckNo}
            required
          />

          <CustomInput
            id="date"
            Type="date"
            label="Date"
            placeholder="Select Date"
            Value={CurrentDate}
            setValue={setDate}
            required
          />
        </div>
      </div>
      <div className="w-[100%] flex justify-center my-5 mt-1">
        {Loading ? (
          <ProcessLoader />
        ) : (
          <button
            onClick={handleSubmit}
            className="w-[50%] hover:bg-[#394B92] py-3 hover:text-white border-2 border-[#394B92] text-[#394B92] font-[900] text-xl hover:rounded-xl transition-all ease-in-out duration-500"
          >
            Add Stock
          </button>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AddStockModal;
