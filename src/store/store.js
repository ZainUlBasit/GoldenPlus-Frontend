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
import ArticleSlice from "./Slices/ArticleSlice";
import BranchSlice from "./Slices/BranchSlice";
import ExpenseSlice from "./Slices/ExpenseSlice";
import RMStatsSlice from "./Slices/RMStatsSlice";
import ReturnSlice from "./Slices/ReturnSlice";
import AccountSlice from "./Slices/AccountSlice";

export const store = configureStore({
  reducer: {
    AuthState: AuthReducer,
    CompanyState: CompanyReducer,
    ItemState: ItemSlice,
    CustomerState: CustomerSlice,
    EmployeeState: EmployeeSlice,
    CompanyItemLegderState: CompanyItemLegderSlice,
    PaymentState: PaymentSlice,
    CompanyStatState: CompanyInfoStatSlice,
    TopTenState: TopTenStatSlice,
    AccountsState: AccountsStatSlice,
    CustomerItemLegderState: CustomerItemLegderSlice,
    ArticleState: ArticleSlice,
    BranchState: BranchSlice,
    ExpenseState: ExpenseSlice,
    RMStatsState: RMStatsSlice,
    ReturnState: ReturnSlice,
    AccountState: AccountSlice,
  },
});
