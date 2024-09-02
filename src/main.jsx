import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import CompanyInfo from "./pages/Company/Info";
import CompanyAccounts from "./pages/Company/Accounts";
import CompanyLedger from "./pages/Company/Ledger";
import ItemInfo from "./pages/Items/Info";
import CustomerInfo from "./pages/Customers/Info";
import CustomerLedger from "./pages/Customers/Ledger";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import { store } from "./store/store";
import ProtectedLoginRoute from "./components/ProtectedRoutes/ProtectedLoginRoute";
import LoadingWrapper from "./LoadingWrapper";
import StockStats from "./pages/Items/StockStats";
import CashPaymentInfo from "./pages/Cash Payments/Info";
import CreateBill from "./pages/Customers/CreateBill";
import { Toaster } from "react-hot-toast";
import ReturnBill from "./pages/Customers/ReturnBill";
import ReportInfo from "./pages/Reports/Info";
import CompanyStats from "./pages/Reports/CompanyStats";
import BranchesInfo from "./pages/Branches/Info";
import RM_Stats from "./pages/Company/RM_Stats";
import EditInvoice from "./pages/Customers/EditInvoice";
import NewBillInvoice from "./components/Invoices/NewBillInvoice";
import ReturnInvoice from "./components/Invoices/ReturnInvoice";
import ItemLedgerReport from "./components/Invoices/ItemLedgerReport";
import Summary from "./pages/Cash Payments/Summary";
import CustomerReport from "./components/Invoices/CustomerReport";
import CompanyReport from "./components/Invoices/CompanyReport";
import FixedAssets from "./pages/Cash Payments/FixedAssets";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProtectedLoginRoute>
        <Login />
      </ProtectedLoginRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier",
    element: (
      <ProtectedRoute>
        <CompanyInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier/accounts",
    element: (
      <ProtectedRoute>
        <CompanyAccounts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier/ledger",
    element: (
      <ProtectedRoute>
        <CompanyLedger />
      </ProtectedRoute>
    ),
  },
  {
    path: "/supplier/stock-stat",
    element: (
      <ProtectedRoute>
        <RM_Stats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/ledger",
    element: (
      <ProtectedRoute>
        <CustomerLedger />
      </ProtectedRoute>
    ),
  },
  {
    path: "/items",
    element: (
      <ProtectedRoute>
        <ItemInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/stock-stat",
    element: (
      <ProtectedRoute>
        <StockStats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer",
    element: (
      <ProtectedRoute>
        <CustomerInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/ledger",
    element: (
      <ProtectedRoute>
        <CustomerLedger />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/edit-invoice",
    element: (
      <ProtectedRoute>
        <EditInvoice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/invoice/detail/:id",
    element: (
      <ProtectedRoute>
        <NewBillInvoice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/return-invoice/detail/:id",
    element: (
      <ProtectedRoute>
        <ReturnInvoice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/create-bill",
    element: (
      <ProtectedRoute>
        <CreateBill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/item-ledger-report",
    element: (
      <ProtectedRoute>
        <ItemLedgerReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer-report",
    element: (
      <ProtectedRoute>
        <CustomerReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/company-report",
    element: (
      <ProtectedRoute>
        <CompanyReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports/company-stats",
    element: (
      <ProtectedRoute>
        <CompanyStats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customer/create-bill-return",
    element: (
      <ProtectedRoute>
        <ReturnBill />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cash-payments",
    element: (
      <ProtectedRoute>
        <CashPaymentInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cash-summary",
    element: (
      <ProtectedRoute>
        <Summary />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fixed-assets",
    element: (
      <ProtectedRoute>
        <FixedAssets />
      </ProtectedRoute>
    ),
  },
  {
    path: "/branches",
    element: (
      <ProtectedRoute>
        <BranchesInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <LoadingWrapper>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </LoadingWrapper>
    </Provider>
  </React.StrictMode>
);
