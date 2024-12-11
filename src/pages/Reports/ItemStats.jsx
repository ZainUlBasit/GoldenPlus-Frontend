import React, { useEffect, useState } from "react";
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
import { StockStatsColumns } from "../../utils/ColumnsData/StockStatsColumns";
import SimpleTable from "../../components/Tables/SimpleTable";
import { CustomerItemLedgerColumns } from "../../utils/ColumnsData/ItemLedgerColumns";

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
      <div className="flex justify-end items-center w-[98.5%] pt-5">
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
                    ArticleState.data
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
      {ArticleStatsState.data.StockStats && (
        <SimpleTable
          columns={StockStatsColumns}
          title={"Article Stock Statistics"}
          rows={ArticleStatsState.data.StockStats}
          ReportTable={true}
        />
      )}
      {ArticleStatsState.data.StockStats && (
        <SimpleTable
          columns={CustomerItemLedgerColumns}
          title={"Article Sales Statistics"}
          rows={ArticleStatsState.data.trans}
        />
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
