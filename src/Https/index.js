import axios from "axios";
import { BASE_URL, BASE_URL_LOCAL } from "../assets/config";

const token = localStorage.getItem("token");
export const api = axios.create({
  baseURL: BASE_URL_LOCAL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    token,
  },
});

export const apiForImage = axios.create({
  baseURL: BASE_URL_LOCAL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    token,
  },
});

// AUth requests
export const LoginApi = (payload) => api.post("/auth/login", payload);

//  Suppliers Requests
export const CreateCompanyApi = (payload) =>
  api.post("/company/create", payload);
export const UpdateCompanyApi = (payload) =>
  api.patch("/company/update", payload);
export const DeleteCompanyApi = (id) => api.delete("/company/delete/" + id);
export const GetCompanyApi = (payload) => api.post("/company/branch", payload);
export const GetCompanyItemLedgerApi = (payload) =>
  api.post("/company/item-ledger", payload);
// Raw Material
export const GetRM_StatsApi = (payload) =>
  api.post("/raw-material/branch", payload);
export const AddRM_StatsApi = (payload) =>
  api.post("/raw-material/add", payload);
export const Update_RM_StatsApi = (payload) =>
  api.patch("/raw-material/edit", payload);
export const Delete_RM_StatsApi = (payload) =>
  api.post("/raw-material/delete", payload);

export const UpdateCompanyOpeningBalanceApi = (payload) =>
  api.patch("/company/update-opening-balance", payload);

// ======================================
//  items requests
// ======================================
export const CreateItemApi = (payload) => api.post("/item/create", payload);
export const DeleteItemApi = (payload) => api.post("/item/delete", payload);
export const UpdateItemApi = (payload) => api.patch("/item/update", payload);
export const UpdateItemQtyApi = (payload) => api.post("/stock/add", payload);
export const EditStockStatsApi = (payload) => api.patch("/stock/edit", payload);
export const DeleteStockStatsApi = (id) => api.delete("/stock/delete/" + id);
export const GetStockStatsApi = (payload) => api.post("/stock/branch", payload);

export const GetItemsByBranchApi = (payload) =>
  api.post("/item/branch", payload);

// Article Stats Requests
export const GetArticlesStatsApi = (id) => api.get("/stats/article-stat/" + id);

// Article Requests
export const GetArticlesByBranchApi = (id) => api.get("/article/branch/" + id);
export const CreateArticleApi = (payload) =>
  api.post("/article/create", payload);
export const UpdateArticleApi = (payload) =>
  api.patch("/article/update", payload);

// Customer REQUESTS
export const CreateCustomerApi = (payload) =>
  api.post("/customer/create", payload);
export const GetCustomerBranchApi = (payload) =>
  api.post("/customer/branch", payload);
export const DeleteCustomerApi = (id) => api.delete("/customer/delete/" + id);
export const UpdateCustomerApi = (payload) =>
  api.patch("/customer/update", payload);
export const UpdateCustomerOpeningBalanceApi = (payload) =>
  api.patch("/customer/update-opening-balance", payload);

export const GetCustomerApi = () => api.get("/customer");
export const GetBillNoApi = (id) => api.get("/customer/get-bill-nos/" + id);

// Employee Requests
export const CreateEmployeeApi = (payload) => api.post("/employee", payload);
export const UpdateEmployeeApi = (payload) => api.patch("/employee", payload);
export const DeleteEmployeeApi = (payload) =>
  api.post("/employee/delete", payload);
export const GetEmployeeApi = () => api.get("/employee");

// Payment Requests
export const CreatePaymentApi = (payload) =>
  api.post("/payment/create", payload);
export const GetPaymentsByIdApi = (payload) =>
  api.post("/payment/branch", payload);
export const DeletePaymentAPI = (id) => api.delete("/payment/delete/" + id);
export const UpdatePaymentAPI = (id, payload) =>
  api.delete("/payment/update/" + id, payload);

// Transactions Request
export const CheckInvoiceNoApi = (payload) =>
  api.post("/transaction/check-invoice-no", payload);
export const UpdateInvoiceNoApi = (payload) =>
  api.post("/transaction/update-invoice-data", payload);
export const GetInvoiceDataApi = (payload) =>
  api.post("/transaction/get-invoice-item", payload);
export const CreateTransactionApi = (payload) =>
  api.post("/transaction/create", payload);
export const GetTransactionByIdApi = (payload) =>
  api.post("/transaction/all", payload);
export const DeleteInvoiceApi = (payload) =>
  api.post("/transaction/delete", payload);

// RETURN REQUEST
// export const CreateReturnApi = (payload) => api.post("/return", payload);
// export const GetReturnByIdApi = (payload) =>
// api.post("/return/get-by-id", payload);
export const CreateReturnApi = (payload) =>
  api.post("/sale-return/create", payload);
export const GetReturnsByIdApi = (payload) =>
  api.post("/sale-return/branch", payload);
export const DeleteReturnsInvoiceApi = (payload) =>
  api.post("/sale-return/delete", payload);

// Statistics
export const GetCompanyInfoStatsApi = () => api.get("/stats/company_info");
export const GetTopTenStatsApi = () => api.get("/stats/top-ten");
export const GetAccountsStatsApi = () => api.get("/stats/accounts-info");

// Branches
export const CreateNewBranchApi = (payload) =>
  api.post("/branch/create", payload);
export const GetAllBranchApi = () => api.get("/branch/all");
export const UpdateBranchApi = (payload) =>
  api.patch("/branch/update", payload);

// Expense
export const GetExpensesApi = (payload) => api.post("/report/branch", payload);
export const CreateExpensesApi = (payload) =>
  api.post("/report/create", payload);
export const UpdateExpensesApi = (payload) =>
  api.patch("/report/update", payload);

// Accounts
export const CreateAccountApi = (payload) =>
  api.post("/accounts/create", payload);
export const GetAccountsApi = (payload) => api.post("/accounts/get", payload);
export const UpdateAccountsAmountApi = (payload) =>
  api.patch("/accounts/add-amount", payload);
