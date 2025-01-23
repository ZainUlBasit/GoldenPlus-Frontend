import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./Slices/AuthSlice";
import CompanyReducer from "./Slices/CompanySlice";
import ItemSlice from "./Slices/ItemSlice";
import CustomerSlice from "./Slices/CustomerSlice";
import EmployeeSlice from "./Slices/EmployeeSlice";
import CompanyItemLegderSlice from "./Slices/CompanyItemLegderSlice";
import PaymentSlice from "./Slices/PaymentSlice";
import CompanyInfoStatSlice from "./Slices/CompanyInfoStatSlice";
import TopTenStatSlice from "./Slices/TopTenStatSlice";
import AccountsStatSlice from "./Slices/AccountsStatSlice";
import CustomerItemLegderSlice from "./Slices/CustomerItemLegderSlice";
import CustomerLegderSlice from "./Slices/CustomerLegderSlice";
import ArticleSlice from "./Slices/ArticleSlice";
import BranchSlice from "./Slices/BranchSlice";
import ExpenseSlice from "./Slices/ExpenseSlice";
import RMStatsSlice from "./Slices/RMStatsSlice";
import ReturnSlice from "./Slices/ReturnSlice";
import AccountSlice from "./Slices/AccountSlice";
import ArticleStatSlice from "./Slices/ArticleStatsSlice";
import SupplierLegderSlice from "./Slices/SupplierLegderSlice";
import CashSummarySlice from "./Slices/CashSummarySlice";
import InvoiceDetailSlice from "./Slices/CustomerInvoiceDetailSlice";
import StockStatsSlice from "./Slices/StockStatsSlice";

export const store = configureStore({
  reducer: {
    AuthState: AuthReducer,
    CompanyState: CompanyReducer,
    ItemState: ItemSlice,
    CustomerState: CustomerSlice,
    EmployeeState: EmployeeSlice,
    CompanyItemLegderState: CompanyItemLegderSlice,
    SupplierLegderState: SupplierLegderSlice,
    PaymentState: PaymentSlice,
    CompanyStatState: CompanyInfoStatSlice,
    TopTenState: TopTenStatSlice,
    AccountsState: AccountsStatSlice,
    CustomerItemLegderState: CustomerItemLegderSlice,
    CustomerLegderState: CustomerLegderSlice,
    ArticleState: ArticleSlice,
    BranchState: BranchSlice,
    ExpenseState: ExpenseSlice,
    RMStatsState: RMStatsSlice,
    ReturnState: ReturnSlice,
    AccountState: AccountSlice,
    ArticleStatsState: ArticleStatSlice,
    CashSummaryState: CashSummarySlice,
    InvoiceDetailState: InvoiceDetailSlice,
    StockStatsState: StockStatsSlice,
  },
});
