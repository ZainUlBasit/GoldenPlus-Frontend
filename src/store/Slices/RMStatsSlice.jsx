import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetRM_StatsApi } from "../../Https";

export const fetchRMStats = createAsyncThunk(
  "fetch/rm-stats",
  async (payload) => {
    try {
      const response = await GetRM_StatsApi(payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const RMStatsSlice = createSlice({
  name: "articles",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRMStats.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchRMStats.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchRMStats.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default RMStatsSlice.reducer;
