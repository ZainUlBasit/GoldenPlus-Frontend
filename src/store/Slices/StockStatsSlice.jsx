import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetCompanyItemLedgerApi,
  GetRMStockStatsApi,
  GetStockStatsApi,
} from "../../Https";

export const fetchStockStats = createAsyncThunk(
  "fetch/Stock-Stats",
  async (Payload) => {
    try {
      const response = await GetStockStatsApi(Payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const StockStatsSlice = createSlice({
  name: "stock-stats",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStockStats.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchStockStats.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchStockStats.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default StockStatsSlice.reducer;
