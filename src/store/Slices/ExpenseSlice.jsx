import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetCompanyApi,
  GetCustomerApi,
  GetEmployeeApi,
  GetExpensesApi,
} from "../../Https";

export const fetchExpenses = createAsyncThunk(
  "fetch/Expenses",
  async (payload) => {
    try {
      const response = await GetExpensesApi(payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const ExpenseSlice = createSlice({
  name: "expenses",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchExpenses.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default ExpenseSlice.reducer;
