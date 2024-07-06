// import { BillItemColumns } from "@/assets/Columns/BillItemColumns";
// import { CashLedgerColumns } from "@/assets/Columns/CashLedgerColumns";
// import { ItemLedgerColumns } from "@/assets/Columns/ItemLedgerColumns";
// import ItemLedgerCard from "@/components/Cards/ItemLedgerCard";
// import CustomInput from "@/components/Inputs/CustomInput";
// import CustomPopOver from "@/components/Inputs/CustomPopOver";
// import ProcessLoader from "@/components/Loader/ProcessLoader";
// import SimpleTable from "@/components/Tables/SimpleTable";
// import { ErrorToast, SuccessToast, WarningToast } from "@/utils/ShowToast";
// import { fetchCompanies } from "@/utils/Slices/CompanySlice";
// import { fetchCustomers } from "@/utils/Slices/CustomerSlice";
// import { fetchItems } from "@/utils/Slices/ItemSlice";
// import { fetchPaymentById } from "@/utils/Slices/PaymentSlice";
import { Popover, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../store/Slices/CustomerSlice";
import { fetchItems } from "../../store/Slices/ItemSlice";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import Navbar from "../../components/Navbar/Navbar";
import CustomerNav from "../../components/Navigations/CustomerNav";
import CustomInput from "../../components/Inputs/CustomInput";
import {
  CheckInvoiceNoApi,
  CreateTransactionApi,
  GetBillNoApi,
  GetInvoiceDataApi,
} from "../../Https";
import { ErrorToast, SuccessToast, WarningToast } from "../../utils/ShowToast";
import SimpleTable from "../../components/Tables/SimpleTable";
import { BillItemColumns } from "../../utils/ColumnsData/BillItemColumns";
import ProcessLoader from "../../components/Loader/ProcessLoader";

export default function EditInvoice() {
  const [CurrentCustomer, setCurrentCustomer] = useState("");
  const CustomerState = useSelector((state) => state.CustomerState);
  const [BillNo, setBillNo] = useState("");
  const [BillNoExists, setBillNoExists] = useState(true);
  const [ItemCode, setItemCode] = useState("");
  const [ItemName, setItemName] = useState("");
  const [ItemQty, setItemQty] = useState("");
  const [ItemPrice, setItemPrice] = useState("");
  const [ItemTotal, setItemTotal] = useState("");
  const [Discount, setDiscount] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [Payment, setPayment] = useState(0);
  const [CurrentDate, setCurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [ItemId, setItemId] = useState("");
  const [ItemArticle, setItemArticle] = useState("");
  const [CurrentItemQty, setCurrentItemQty] = useState("");
  const dispatch = useDispatch();
  const ItemState = useSelector((state) => state.ItemState);
  const ArticleState = useSelector((state) => state.ArticleState);
  const itemCodeInputRef = useRef(null);
  const [NewItems, setNewItems] = useState([]);
  const [ItemSize, setItemSize] = useState("");
  const [Loading, setLoading] = useState(false);
  const AuthState = useSelector((state) => state.AuthState);
  const [BillNos, setBillNos] = useState([]);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        branch:
          AuthState.data.role === 2
            ? AuthState.data.branchId.branch_number
            : -1,
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
    dispatch(
      fetchArticles(
        AuthState.data.role === 2 ? AuthState.data.branchId.branch_number : -1
      )
    );
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCustomerSelect = (customer) => {
    setCurrentCustomer(customer);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [anchorElBillNo, setAnchorElBillNo] = useState(null);

  const handleClickBillNo = (event) => {
    setAnchorElBillNo(event.currentTarget);
  };

  const [CurrentBillNo, setCurrentBillNo] = useState("");

  const handleCloseBillNo = () => {
    setAnchorElBillNo(null);
  };

  const handleBillSelect = (customer) => {
    setCurrentBillNo(customer);
    handleCloseBillNo();
  };

  const openBillNo = Boolean(anchorElBillNo);
  const idBillNo = openBillNo ? "bill-no-popover" : undefined;

  const GetBillNumbers = async () => {
    try {
      const response = await GetBillNoApi(CurrentCustomer._id);
      setBillNos(response.data.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  const [CurrentInvoiceData, setCurrentInvoiceData] = useState("");
  const [FetchingLoading, setFetchingLoading] = useState(false);
  const GetInvoiceData = async () => {
    setFetchingLoading(true);
    try {
      const response = await GetInvoiceDataApi({
        invoice_no: CurrentBillNo.invoice_no,
        type: CurrentBillNo.type,
      });
      console.log(response.data.data.payload);
      setCurrentInvoiceData(response.data.data.payload);
      //     setCurrentDate(() => {
      //   const today = new Date();
      //   const yyyy = today.getFullYear();
      //   const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      //   const dd = String(today.getDate()).padStart(2, '0');
      //   return `${yyyy}-${mm}-${dd}`;
      // })
    } catch (err) {
      console.log(err);
    }
    setFetchingLoading(false);
  };

  useEffect(() => {
    if (CurrentCustomer !== "") {
      GetBillNumbers();
    }
  }, [CurrentCustomer]);

  useEffect(() => {
    if (CurrentBillNo !== "") {
      GetInvoiceData();
    }
  }, [CurrentBillNo]);

  const handleAddItem = () => {
    if (ItemSize === "" || ItemQty === "" || ItemPrice === "") {
      WarningToast("Please enter item code/qty/price");
    } else {
      setNewItems([
        ...NewItems,
        {
          itemId: ItemId,
          article_name: ItemArticle,
          article_size: ItemSize,
          qty: Number(ItemQty),
          purchase: Number(
            ItemState.data.find(
              (dt) =>
                Number(dt.size) === Number(ItemSize) &&
                dt.articleId.name === ItemArticle
            ).purchase
          ),
          price: Number(ItemPrice),
          amount: Number(ItemTotal),
        },
      ]);
      setItemSize("");
      setItemArticle("");
      setItemId("");
      setItemQty("");
      setItemPrice("");
      setItemTotal("");
      itemCodeInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (NewItems.length !== 0) {
      const total = NewItems.reduce((acc, item) => acc + item.amount, 0);
      setTotalAmount(total - Number(Discount || 0));
    }
  }, [NewItems, Discount]);

  // const HandleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     if (Payment !== "" && Number(Payment) > 0) {
  //       const formData = new FormData();
  //       formData.append("user_type", 2);
  //       formData.append("user_Id", SelectCustomer.name);
  //       formData.append(
  //         "user_name",
  //         CustomerState.data.find((dt) => dt._id === CurrentCustomer)?.name
  //       );
  //       formData.append(
  //         "depositor",
  //         CustomerState.data.find((dt) => dt._id === CurrentCustomer)?.name
  //       );
  //       formData.append("payment_type", 1);
  //       formData.append("amount", Number(Payment));
  //       formData.append("date", CurrentDate);
  //       formData.append("desc", "Payment during transaction");
  //       const responseCash = await CreatePaymentApi(formData);
  //       if (responseCash.data.success) {
  //         SuccessToast(responseCash.data.data.msg);
  //       } else {
  //         ErrorToast(responseCash.data.error.msg);
  //       }
  //     }
  //     const response = await CreateTransactionApi({
  //       customerId: CurrentCustomer,
  //       date: CurrentDate,
  //       items: NewItems,
  //       discount: Number(Discount),
  //       invoice_no: BillNo,
  //     });
  //     // console.log("transaction: ", response);
  //     if (!response.data?.success) ErrorToast(response.data?.error?.msg);
  //     else {
  //       SuccessToast(response.data?.data?.msg);
  //       resetStates();
  //     }
  //   } catch (err) {
  //     ErrorToast(err.response?.data?.error?.msg || err?.message);
  //   }
  // };

  // const resetStates = () => {
  //   setTimeout(() => {
  //     setNewItems([]);
  //     setTotalAmount(0);
  //     setDiscount(0);
  //     setCurrentCustomer("");
  //     setPayment("");
  //     setBillNo("");
  //     setCurrentCustomer("");
  //     setLoading(false);
  //   }, 4000);
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CustomerNav />
      <div className="flex gap-x-2 flex-wrap pt-4">
        <CustomPopOver
          label={"Select Customer"}
          placeholder={"Select Customer"}
          required={false}
          Value={
            CustomerState.data.find((dt) => dt._id === CurrentCustomer._id)
              ?.name || "Select Customer"
          }
          onClick={handleClick}
        />
        {CurrentCustomer !== "" && BillNos && (
          <CustomPopOver
            label={"Select Invoice #"}
            placeholder={"Select Invoice #"}
            required={false}
            Value={CurrentBillNo?.invoice_no || "Select Invoice #"}
            onClick={handleClickBillNo}
          />
        )}
        <Popover
          id={idBillNo}
          open={openBillNo}
          anchorEl={anchorElBillNo}
          onClose={handleCloseBillNo}
          PaperProps={{
            sx: {
              borderRadius: "25px", // Add rounded corners
              backgroundColor: "white", // Set background color to white
              width: "300px", // Set the width as needed
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
              width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                {BillNos.map((dt) => (
                  <div
                    key={dt.invoice_no}
                    className="flex gap-x-3 items-center cursor-pointer"
                    onClick={() => handleBillSelect(dt)}
                  >
                    <input
                      type="checkbox"
                      className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                      checked={CurrentBillNo.invoice_no === dt.invoice_no}
                      readOnly
                    />
                    <span>{dt.invoice_no}</span>
                  </div>
                ))}
              </div>
            </div>
          </Typography>
        </Popover>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: "25px", // Add rounded corners
              backgroundColor: "white", // Set background color to white
              width: "300px", // Set the width as needed
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
              width: "400px",
              overflow: "hidden",
              borderRadius: "25px",
            }}
          >
            <div className="bg-[#000] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
              <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                {CustomerState.data.map((dt) => (
                  <div
                    key={dt._id}
                    className="flex gap-x-3 items-center cursor-pointer"
                    onClick={() => handleCustomerSelect(dt)}
                  >
                    <input
                      type="checkbox"
                      className="mr-1 appearance-none h-5 w-5 border border-gray-300 checked:bg-white rounded-full"
                      checked={CurrentCustomer._id === dt._id}
                      readOnly
                    />
                    <span>{dt.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Typography>
        </Popover>
      </div>
      {FetchingLoading ? (
        <div className="flex justify-center items-center pt-4">
          <ProcessLoader />
        </div>
      ) : (
        CurrentInvoiceData.Data && (
          <div className="w-full pt-4 flex justify-center items-center flex-col">
            <div className="py-3 px-3 w-[94%] border-2 border-white bg-black text-white rounded-lg ">
              <div className="w-full flex justify-center py-5 pb-7 font-bold text-3xl border-b-2 border-b-white mb-3">
                Invoice Info
              </div>
              <div className="flex gap-x-2 text-2xl">
                <div className="font-bold">Invoice No. </div>
                <div className="">
                  {CurrentInvoiceData.Invoice_Info.invoice_no}
                </div>
              </div>
              <div className="flex gap-x-2 text-2xl">
                <div className="font-bold">Customer Name: </div>
                <div className="">
                  {
                    CustomerState.data.find(
                      (dt) =>
                        dt._id ===
                        CurrentInvoiceData.Invoice_Info.customerId._id
                    )?.name
                  }
                </div>
              </div>
            </div>
            <SimpleTable
              columns={BillItemColumns}
              title={"Item Details"}
              rows={CurrentInvoiceData.Data}
            />
          </div>
        )
      )}

      {CurrentInvoiceData.Data && (
        <div className="flex flex-wrap gap-x-3 gap-y-3 py-7 px-4">
          <div className="relative w-[300px] maxInputWidth font-[Quicksand] h-[48px]">
            <p className="absolute top-[-11px] left-3 w-fit bg-white h-[13px] text-[15px] font-bold InputLabel">
              Date
            </p>
            <input
              type={"date"}
              // required={}
              placeholder={"Select Date..."}
              className="px-3 py-2 border border-[#000] rounded-[7.94px] w-full outline-none InputText shadow-[#0e25802d_0px_2px_8px_0px] font-bold text-[15px] placeholder:font-normal h-full"
              value={
                moment(
                  new Date(CurrentInvoiceData.Invoice_Info.date * 1000)
                ).format("YYYY-MM-DD") ||
                moment(new Date()).format("YYYY-MM-DD")
              }
              readOnly={true}
              onChange={(e) => {}}
              disabled={true}
            />
          </div>
          <div className="relative w-[300px] maxInputWidth font-[Quicksand] h-[48px]">
            <p className="absolute top-[-11px] left-3 w-fit bg-white h-[13px] text-[15px] font-bold InputLabel">
              Discount
            </p>
            <input
              type={"number"}
              placeholder={"Enter Discount..."}
              className="px-3 py-2 border border-[#000] rounded-[7.94px] w-full outline-none InputText shadow-[#0e25802d_0px_2px_8px_0px] font-bold text-[15px] placeholder:font-normal h-full"
              value={CurrentInvoiceData.Invoice_Info.discount || 0}
              readOnly={true}
              onChange={(e) => {}}
              disabled={true}
            />
          </div>
          <div className="relative w-[300px] maxInputWidth font-[Quicksand] h-[48px]">
            <p className="absolute top-[-11px] left-3 w-fit bg-white h-[13px] text-[15px] font-bold InputLabel">
              Total
            </p>
            <input
              type={"number"}
              placeholder={"Enter Total..."}
              className="px-3 py-2 border border-[#000] rounded-[7.94px] w-full outline-none InputText shadow-[#0e25802d_0px_2px_8px_0px] font-bold text-[15px] placeholder:font-normal h-full"
              value={CurrentInvoiceData.Invoice_Info.total_amount || 0}
              readOnly={true}
              onChange={(e) => {}}
              disabled={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
