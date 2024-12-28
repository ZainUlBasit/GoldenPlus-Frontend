import React, { useEffect, useRef, useState } from "react";
import CustomerNav from "../../components/Navigations/CustomerNav";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionDetail } from "../../store/Slices/CustomerInvoiceDetailSlice";
import EditInvoiceTable from "../../components/Tables/EditInvoiceTable";
import { InvoiceEditColumns } from "../../utils/ColumnsData/InvoiceEditColumns";
import DeleteModal from "../../components/Modals/DeleteModal";
import { SuccessToast } from "../../utils/ShowToast";
import { DeleteTransactionItemApi } from "../../Https";
import { fetchItems } from "../../store/Slices/ItemSlice";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import AddNewButton from "../../components/Buttons/AddNewBtn";

const EditItemLedgerItem = () => {
  const { id } = useParams();
  const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [SelectedId, setSelectedId] = useState("");
  const [Loading, setLoading] = useState(false);

  const [ItemArticle, setItemArticle] = useState("");
  const [ItemSize, setItemSize] = useState("");
  const [ItemQty, setItemQty] = useState(0);
  const [ItemPrice, setItemPrice] = useState(0);
  const [ItemTotal, setItemTotal] = useState(0);
  const itemCodeInputRef = useRef(null);
  const InvoiceDetailState = useSelector((state) => state.InvoiceDetailState);
  const dispatch = useDispatch();
  const AuthState = useSelector((state) => state.AuthState);
  const ItemState = useSelector((state) => state.ItemState);
  const [AddNewBtn, setAddNewBtn] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactionDetail(id));
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
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <CustomerNav />
      {Object.keys(InvoiceDetailState.data).length > 0 && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[85%] border-2 rounded-xl overflow-hidden max480:w-[95%]">
            <div className="flex flex-col">
              <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
                Date
              </div>
              <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
                {new Date(
                  InvoiceDetailState.data.date * 1000
                ).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
                Customer Name
              </div>
              <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
                {InvoiceDetailState.data.customerId.name}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
                Invoice No
              </div>
              <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
                {InvoiceDetailState.data.invoice_no}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-black text-white px-3 py-1 font-alegreya text-[1.2rem] font-bold rounded-b-xl">
                Total Amount
              </div>
              <div className="font-alegreya font-bold text-[1.1rem] px-4 py-1">
                {new Intl.NumberFormat("en-PK", {
                  style: "currency",
                  currency: "PKR",
                }).format(InvoiceDetailState.data.total_amount)}
              </div>
            </div>
          </div>
          {AddNewBtn ? (
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
                  type="text"
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
                  onClick={() => {
                    setAddNewBtn(false);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="max480:w-[100%] w-[85%] flex justify-end py-4">
              <AddNewButton
                onClick={() => {
                  setAddNewBtn(true);
                }}
              />
            </div>
          )}
          <div className="max480:w-[100%] w-[88%]">
            <EditInvoiceTable
              title={"Items"}
              rows={InvoiceDetailState.data.items}
              columns={InvoiceEditColumns}
              OpenDeleteModal={OpenDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setSelectedId={setSelectedId}
            />
          </div>

          {OpenDeleteModal && SelectedId && (
            <DeleteModal
              Open={OpenDeleteModal}
              setOpen={setOpenDeleteModal}
              onSubmit={async () => {
                setLoading(true);
                console.log(SelectedId);
                try {
                  const response = await DeleteTransactionItemApi({
                    transId: id,
                    itemId: SelectedId,
                  });
                  if (response.data.success) {
                    SuccessToast(response.data.data.msg);
                    setOpenDeleteModal(false);
                    dispatch(fetchTransactionDetail(id));
                  }
                } catch (err) {
                  console.log(err);
                }
                setLoading(false);
              }}
              Loading={Loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditItemLedgerItem;

//  EditItemLedgerItem;
