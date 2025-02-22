import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ReportNav from "../../components/Navigations/ReportNav";
import ReportCard from "../../components/Cards/ReportCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/Slices/ExpenseSlice";
import moment from "moment";
import { ErrorToast } from "../../utils/ShowToast";
import SearchableTable from "../../components/Tables/SearchableTable";
import { ExpenseColumns } from "../../utils/ColumnsData/ExpenseColumns";
import EditExpenseModal from "../../components/Modals/EditExpenseModal";
import CustomPopOver from "../../components/Inputs/CustomPopOver";
import { Popover, Typography } from "@mui/material";
import SearchBox from "../../components/SearhBox/SearchBox";
import { fetchItems } from "../../store/Slices/ItemSlice";
import { fetchArticles } from "../../store/Slices/ArticleSlice";
import { fetchArticleStats } from "../../store/Slices/ArticleStatsSlice";
import {
  ItemStockStatsColumns,
  StockStatsColumns,
} from "../../utils/ColumnsData/StockStatsColumns";
import SimpleTable from "../../components/Tables/SimpleTable";
import { CustomerItemLedgerColumns } from "../../utils/ColumnsData/ItemLedgerColumns";
import DataLoader from "../../components/Loaders/DataLoader";
import { ItemStatsColumns } from "../../utils/ColumnsData/ItemStatsColumns";
import exportToExcel from "../../utils/ExportToExcel";

const ItemStats = () => {
  const [ArticleId, setArticleId] = useState("");
  const [ArticleName, setArticleName] = useState("");
  const [SearchTextPop, setSearchTextPop] = useState("");
  const [anchorElItem, setAnchorElItem] = useState(null);
  const handleClickItem = (event) => {
    setAnchorElItem(event.currentTarget);
  };
  const handleCloseItem = () => {
    setAnchorElItem(null);
  };
  const openItem = Boolean(anchorElItem);
  const idItem = openItem ? "simple-popover-item" : undefined;

  // React Redux Method
  const dispatch = useDispatch();

  //  Redux States
  const ArticleState = useSelector((state) => state.ArticleState);
  const ArticleStatsState = useSelector((state) => state.ArticleStatsState);
  const AuthState = useSelector((state) => state.AuthState);

  const getTotalSoldItems = useMemo(() => {
    if (ArticleStatsState.data.trans) {
      return ArticleStatsState.data.trans.reduce((acc, dt) => acc + dt.qty, 0);
    }
    return 0;
  }, [ArticleStatsState]);

  const getTotalItemStock = useMemo(() => {
    if (ArticleStatsState.data.StockStats) {
      return ArticleStatsState.data.StockStats.reduce(
        (acc, dt) => acc + dt.qty,
        0
      );
    }
    return 0;
  }, [ArticleStatsState]);

  useEffect(() => {
    dispatch(
      fetchArticles(
        AuthState.data.role === 2 ? AuthState.data.branchId.branch_number : -1
      )
    );
  }, []);
  useEffect(() => {
    if (ArticleId !== "") {
      dispatch(fetchArticleStats(ArticleId));
    }
  }, [ArticleId]);
  return (
    <div className="relative">
      <Navbar />
      <ReportNav />
      <div className=" flex justify-center items-center">
        <div className="flex justify-between items-end w-[97%] pt-5 gap-x-2 py-2">
          <div className="flex gap-x-2">
            <div className=" rounded-t-xl">
              <div className="py-2 bg-black text-white font-poppins px-4 rounded-t-xl whitespace-nowrap">
                Total Stock
              </div>
              <div className="border-2 border-gray-300 font-poppins text-xl font-bold text-center py-1">
                {ArticleStatsState.loading === false && ArticleId
                  ? getTotalItemStock
                  : 0}
              </div>
            </div>
            <div className=" rounded-t-xl">
              <div className="py-2 bg-black text-white font-poppins px-4 rounded-t-xl whitespace-nowrap">
                Total Sold Stock
              </div>
              <div className="border-2 border-gray-300 font-poppins text-xl font-bold text-center py-1">
                {ArticleStatsState.loading === false && ArticleId
                  ? getTotalSoldItems
                  : 0}
              </div>
            </div>
          </div>
          <CustomPopOver
            label={"Select Article"}
            placeholder={"Select Supplier"}
            required={false}
            Value={ArticleName || "Select Article"}
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
                width: "300px",
                overflow: "hidden",
                borderRadius: "25px",
              }}
            >
              <div className="bg-[#465462] text-white font-[Quicksand] flex flex-col justify-center items-center rounded-[50px]">
                <div className="w-full flex flex-col justify-between gap-y-3 items-start">
                  <SearchBox
                    Value={SearchTextPop}
                    SetValue={setSearchTextPop}
                    Placeholder={"Search Article"}
                  />
                  <div
                    className="w-full flex flex-col justify-between gap-y-3 items-start"
                    style={{ maxHeight: "30vh", overflowY: "auto" }}
                  >
                    {ArticleState.data &&
                      [
                        {
                          _id: `all_${AuthState.data.branchId._id}`,
                          name: "All",
                        },
                        ...ArticleState.data,
                      ]
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
                              handleCloseItem();
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
              </div>
            </Typography>
          </Popover>
        </div>
      </div>
      {ArticleStatsState.loading && (
        <div className="flex justify-center items-center">
          <DataLoader />{" "}
        </div>
      )}
      {ArticleStatsState.loading === false &&
        ArticleStatsState.data.StockStats &&
        ArticleId && (
          <>
            <div className="w-full flex justify-end px-2 py-3">
              <div
                className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
                onClick={() => {
                  exportToExcel(
                    ArticleStatsState.data.StockStats,
                    "MyExcelFile"
                  );
                }}
              >
                Convert to Excel
              </div>
            </div>
            <SimpleTable
              columns={ItemStockStatsColumns}
              title={"Article Stock Statistics"}
              rows={ArticleStatsState.data.StockStats}
              ReportTable={true}
            />
          </>
        )}
      {ArticleStatsState.loading === false &&
        ArticleStatsState.data.StockStats &&
        ArticleId && (
          <>
            <div className="w-full flex justify-end px-2 py-3">
              <div
                className=" px-3 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all ease-in-out duration-500 cursor-pointer"
                onClick={() => {
                  exportToExcel(ArticleStatsState.data.trans, "MyExcelFile");
                }}
              >
                Convert to Excel
              </div>
            </div>
            <SimpleTable
              columns={ItemStatsColumns}
              title={"Article Sales Statistics"}
              rows={ArticleStatsState.data.trans}
            />
          </>
        )}
      {/* <SearchableTable
        setOpenEditModal={setOpenEditModal}
        setOpenDeleteModal={setOpenDeleteModal}
        setSelected={setSelected}
        SearchPlaceholder={"Search Article..."}
        SearchText={SearchText}
        setSearchText={setSearchText}
        CurrentData={
          StockStats.data &&
          StockStats.data
            .filter((dt) => {
              if (ActiveDateFilter) {
                return (
                  dayjs(dt.date * 1000).format("YYYY-MM-DD") >=
                    FromDate.format("YYYY-MM-DD") &&
                  dayjs(dt.date * 1000).format("YYYY-MM-DD") <=
                    ToDate.format("YYYY-MM-DD")
                );
              }
              return true;
            })
            .filter((dt) =>
              SearchText === ""
                ? true
                : dt.article_name
                    .toLowerCase()
                    .includes(SearchText.toLowerCase())
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        Columns={StockStatsColumns}
      /> */}
    </div>
  );
};

export default ItemStats;
