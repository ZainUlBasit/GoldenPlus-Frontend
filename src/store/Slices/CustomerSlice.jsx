import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetCustomerBranchApi } from "../../Https";

export const fetchCustomers = createAsyncThunk(
  "fetch/CustomerDetails",
  async (payload) => {
    try {
      const response = await GetCustomerBranchApi(payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const CustomerSlice = createSlice({
  name: "customer",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default CustomerSlice.reducer;
