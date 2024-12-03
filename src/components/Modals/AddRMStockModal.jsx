import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import { Typography, Popover } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../Inputs/CustomInput";
import CustomPopOver from "../Inputs/CustomPopOver";
import { SuccessToast, ErrorToast } from "../../utils/ShowToast";
import { AddRM_StatsApi, UpdateItemQtyApi } from "../../Https";
import { fetchItems } from "../../store/Slices/ItemSlice";
import { fetchCompanies } from "../../store/Slices/CompanySlice";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import ProcessLoader from "../Loader/ProcessLoader";
import { fetchCompanyItemLedger } from "../../store/Slices/CompanyItemLegderSlice";
import { fetchRMStats } from "../../store/Slices/RMStatsSlice";
import moment from "moment";
import SearchBox from "../SearhBox/SearchBox";

const AddRMStockModal = ({ OpenModal, setOpenModal }) => {
  const [supplierId, setSupplierId] = useState("");
  const [supplier_name, setSupplier_name] = useState("");
  const [rm_name, setRm_name] = useState("");
  const [Purchase, setPurchase] = useState("");
  const [NewStock, setNewStock] = useState("");
  const [InvoiceNo, setInvoiceNo] = useState("");
  const [TruckNo, setTruckNo] = useState("");
  const [SearchTextPop, setSearchTextPop] = useState("");
  const [CurrentDate, setDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  ); // Initialize with current date
  const [Desc, setDesc] = useState("");
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (
      !supplierId ||
      !supplier_name ||
      !rm_name ||
      !NewStock ||
      !Purchase ||
      !InvoiceNo ||
      !TruckNo ||
      !CurrentDate ||
      !Desc
    ) {
      ErrorToast("All fields are required");
      setLoading(false);
    } else {
      try {
        const { role, branchId } = AuthState.data;
        const branchInfo =
          role === 2
            ? {
                branchId: branchId._id,
                branch_name: branchId.name,
                branch: branchId.branch_number,
              }
            : {
                branchId: "",
                branch_name: "",
                branch: -1,
              };

        const response = await AddRM_StatsApi({
          supplierId,
          supplier_name,
          rm_name,
          purchase: Number(Purchase),
          qty: Number(NewStock),
          invoice_no: InvoiceNo,
          truck_no: TruckNo,
          desc: Desc,
          ...branchInfo,
          date: CurrentDate,
          old: oldBalance,
        });
        if (response.data.success) {
          SuccessToast(response.data.data.msg);
          dispatch(
            fetchRMStats({
              branchId:
                AuthState.data.role === 2 ? AuthState.data.branchId._id : "",
            })
          );
          dispatch(
            fetchCompanies({
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
    const branchNumber =
      AuthState.data.role === 2 ? AuthState.data.branchId.branch_number : -1;

    dispatch(fetchCompanies({ branch: branchNumber }));
    dispatch(fetchArticles(branchNumber));
    dispatch(fetchItems({ branch: branchNumber }));
  }, [dispatch]);

  const [anchorElCompany, setAnchorElCompany] = useState(null);
  const [anchorElArticle, setAnchorElArticle] = useState(null);
  const [anchorElItem, setAnchorElItem] = useState(null);

  const handleClickCompany = (event) => {
    setAnchorElCompany(event.currentTarget);
  };

  const handleClickArticle = (event) => {
    setAnchorElArticle(event.currentTarget);
  };

  const handleClickItem = (event) => {
    setAnchorElItem(event.currentTarget);
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
  const openItem = Boolean(anchorElItem);
  const idCompany = openCompany ? "simple-popover-company" : undefined;
  const idArticle = openArticle ? "simple-popover-article" : undefined;
  const idItem = openItem ? "simple-popover-item" : undefined;

  const [oldBalance, setOldBalance] = useState(false);

  const handleChange = (e) => {
    setOldBalance(e.target.value === "true");
  };

  return (
    <ModalWrapper
      open={OpenModal}
      setOpen={setOpenModal}
      title={"Add Raw Material"}
    >
      <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4 py-4">
        <div className="flex flex-col gap-y-4">
          <CustomPopOver
            label={"Select Supplier"}
            placeholder={"Select Supplier"}
            required={false}
            Value={supplier_name || "Select Supplier"}
            onClick={handleClickArticle}
          />
          <Popover
            id={idArticle}
            open={openArticle}
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
                borderColor: "#465462",
                backgroundColor: "#465462",
                width: "400px",
                overflow: "hidden",
                borderRadius: "25px",
                maxHeight: "30vh",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  <SearchBox
                    Value={SearchTextPop}
                    SetValue={setSearchTextPop}
                    Placeholder={"Search Supplier"}
                  />
                  {CompanyState.data &&
                    CompanyState.data
                      .filter((dt) => {
                        const lowerCaseSearch = SearchTextPop.toLowerCase();
                        const lowerCaseStation = dt.name.toLowerCase();
                        if (SearchTextPop !== "") {
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
                            setSupplierId(dt._id);
                            setSupplier_name(dt.name);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                            checked={supplierId === dt._id}
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
            id="rm-name"
            Type="text"
            label="Raw Material Name"
            placeholder="Enter Raw Material Name"
            Value={rm_name}
            setValue={setRm_name}
            required
          />
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

          <div className="flex flex-col justify-start items-start">
            <div className="flex items-center gap-x-2">
              <input
                type="radio"
                id="no"
                name="old_balance"
                value={false}
                checked={oldBalance === false}
                onChange={handleChange}
              />
              <label for="no">New Material</label>
            </div>
            <div className="flex items-center gap-x-2">
              <input
                type="radio"
                id="yes"
                name="old_balance"
                value={true}
                checked={oldBalance === true}
                onChange={handleChange}
              />
              <label for="yes">Old Material</label>
            </div>
          </div>
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

export default AddRMStockModal;
