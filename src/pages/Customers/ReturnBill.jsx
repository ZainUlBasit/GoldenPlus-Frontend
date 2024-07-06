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
import { CheckInvoiceNoApi, CreateReturnApi } from "../../Https";
import { ErrorToast, SuccessToast, WarningToast } from "../../utils/ShowToast";
import SimpleTable from "../../components/Tables/SimpleTable";
import { BillItemColumns } from "../../utils/ColumnsData/BillItemColumns";
import AddingLoader from "../../components/Loaders/AddingLoader";
import { useNavigate } from "react-router-dom";

export default function ReturnBill() {
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
  const navigate = useNavigate();

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
    setCurrentCustomer(customer._id);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const CheckBillFetch = async () => {
    try {
      const response = await CheckInvoiceNoApi({
        invoice_no: Number(BillNo),
      });
      setBillNoExists(response.data.data.payload.exists);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (BillNo !== "") {
      CheckBillFetch();
    } else {
      setBillNoExists(true);
    }
  }, [BillNo]);

  useEffect(() => {
    if (ItemSize === "") {
      setItemPrice("");
      setItemName("");
      setItemId("");
    } else {
      const currentItem = ItemState.data.find((dt) => {
        return (
          Number(dt.size) === Number(ItemSize) &&
          dt.articleId.name === ItemArticle
        );
      });
      console.log(currentItem);
      if (currentItem) {
        console.log(currentItem);
        setItemPrice(currentItem.sale);
        setItemName(currentItem.name);
        setItemId(currentItem._id);
        setCurrentItemQty(currentItem.qty);
      } else {
        setItemPrice("");
        setItemName("");
        setItemId("");
        setCurrentItemQty("");
      }
    }
  }, [ItemSize]);

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

  const HandleSubmit = async () => {
    setLoading(true);
    try {
      if (Payment !== "" && Number(Payment) > 0) {
        const formData = new FormData();
        formData.append("user_type", 2);
        formData.append("user_Id", SelectCustomer.name);
        formData.append(
          "user_name",
          CustomerState.data.find((dt) => dt._id === CurrentCustomer)?.name
        );
        formData.append(
          "depositor",
          CustomerState.data.find((dt) => dt._id === CurrentCustomer)?.name
        );
        formData.append("payment_type", 1);
        formData.append("amount", Number(Payment));
        formData.append("date", CurrentDate);
        formData.append("desc", "Payment during transaction");
        const responseCash = await CreatePaymentApi(formData);
        if (responseCash.data.success) {
          SuccessToast(responseCash.data.data.msg);
        } else {
          ErrorToast(responseCash.data.error.msg);
        }
      }
      const response = await CreateReturnApi({
        customerId: CurrentCustomer,
        date: CurrentDate,
        items: NewItems,
        invoice_no: BillNo,
      });
      // console.log("transaction: ", response);
      if (!response.data?.success) ErrorToast(response.data?.error?.msg);
      else {
        SuccessToast(response.data?.data?.msg);
        resetStates();
        navigate("/customer/return-invoice/detail/" + BillNo);
      }
    } catch (err) {
      ErrorToast(err.response?.data?.error?.msg || err.message);
    }
  };

  const resetStates = () => {
    setTimeout(() => {
      setNewItems([]);
      setTotalAmount(0);
      setDiscount(0);
      setCurrentCustomer("");
      setPayment("");
      setBillNo("");
      setCurrentCustomer("");
      setLoading(false);
    }, 4000);
  };

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
            CustomerState.data.find((dt) => dt._id === CurrentCustomer)?.name ||
            "Select Customer"
          }
          onClick={handleClick}
        />
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
                      checked={CurrentCustomer === dt._id}
                      readOnly
                    />
                    <span>{dt.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Typography>
        </Popover>
        {CurrentCustomer && (
          <CustomInput
            id="bill-no"
            Type="number"
            label="Bill No"
            placeholder="Enter Bill #"
            Value={BillNo}
            setValue={setBillNo}
            required
          />
        )}
      </div>
      {!BillNoExists && (
        <div className="flex flex-col my-4">
          <div className="text-2xl font-bold text-black px-3 py-1">
            Add New Item
          </div>
          <div className="flex gap-x-3 flex-wrap gap-y-3 justify-center items-center py-4 px-3 w-full border-2 border-black bg-black rounded-lg">
            <input
              type="text"
              list="Article-Code"
              id="fruit"
              name="fruit"
              value={ItemArticle}
              onChange={(e) => setItemArticle(e.target.value)}
              placeholder="Select Article"
              className="px-2 py-2 outline-none rounded-lg border-[#000] border-2"
              onBlur={(e) => {
                const currentItem = ItemState.data.find(
                  (dt) =>
                    dt.articleId.name.toLowerCase() ===
                    e.target.value.toLowerCase()
                );
                if (!currentItem) setItemArticle("");
              }}
              ref={itemCodeInputRef}
            />
            <datalist id="Article-Code">
              {ItemState.data &&
                ItemState.data.map((option) => (
                  <option key={option._id} value={option.articleId.name} />
                ))}
            </datalist>
            <input
              type="number"
              list="Article-Size"
              id="fruit"
              name="fruit"
              value={ItemSize}
              onChange={(e) => setItemSize(e.target.value)}
              placeholder="Select Size"
              className="px-2 py-2 outline-none rounded-lg border-[#000] border-2"
              onBlur={(e) => {
                const currentItem = ItemState.data.find(
                  (dt) => dt.size === e.target.value
                );
                if (!currentItem) setItemSize("");
              }}
              //   ref={itemCodeInputRef}
            />
            <datalist id="Article-Size">
              {ItemState.data &&
                ItemState.data.map((option) => (
                  <option key={option._id} value={option.size} />
                ))}
            </datalist>
            <input
              type="number"
              value={ItemQty}
              onChange={(e) => {
                setItemQty(e.target.value);
                if (e.target.value === "") {
                  setItemTotal("");
                } else {
                  setItemTotal(Number(ItemPrice) * Number(e.target.value));
                }
              }}
              onBlur={(e) => {
                if (Number(e.target.value) > CurrentItemQty) {
                  WarningToast(
                    `Quantity must be less than or equal to ${CurrentItemQty}`
                  );
                  setItemQty("");
                  setItemTotal("");
                }
              }}
              placeholder="Enter Quantity"
              className="px-2 py-2 outline-none rounded-lg border-[#000] border-2"
            />
            <input
              type="number"
              value={ItemPrice}
              onChange={(e) => {
                setItemPrice(e.target.value);
                setItemTotal(Number(e.target.value) * Number(ItemQty));
              }}
              className="bg-white px-2 py-2 outline-none rounded-lg border-[#000] border-2"
              placeholder="Unit Price"
            />
            <input
              type="number"
              value={ItemTotal}
              disabled
              className="bg-white px-2 py-2 outline-none rounded-lg  border-[#000] border-2"
              placeholder="Total Amount"
            />
            <button
              className="bg-white text-gray-600 px-3 py-2 border-2 border-gray-600 hover:bg-gray-600 hover:text-white hover:rounded-lg transition-all ease-in-out duration-500 font-bold"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {NewItems.length !== 0 && (
        <>
          <SimpleTable
            title={"Bill Items"}
            rows={NewItems}
            columns={BillItemColumns}
          />
          <div className="flex gap-x-3 flex-wrap gap-y-3 justify-center items-center py-4 px-3 w-fit border-2 border-black rounded-lg my-5">
            <CustomInput
              id="date"
              Type="date"
              label="Date"
              placeholder="Date"
              Value={CurrentDate}
              setValue={setCurrentDate}
              required
            />
            <CustomInput
              id="total-amount"
              Type="number"
              label="Total"
              placeholder="Total Amount"
              Value={TotalAmount}
              setValue={setTotalAmount}
              required
              disabled={true}
            />
          </div>
        </>
      )}
      {!BillNoExists &&
        NewItems.length !== 0 &&
        (Loading ? (
          <div className="flex gap-x-2 mb-5">
            <AddingLoader />
          </div>
        ) : (
          <div className="flex gap-x-2 mb-5">
            <div
              className="px-2 py-2 border-2 border-black hover:rounded-lg transition-all ease-in-out duration-500 hover:bg-gray-600 bg-black text-white hover:text-white cursor-pointer w-[200px] flex justify-center items-center font-bold"
              onClick={HandleSubmit}
            >
              Add
            </div>
          </div>
        ))}
    </div>
  );
}
