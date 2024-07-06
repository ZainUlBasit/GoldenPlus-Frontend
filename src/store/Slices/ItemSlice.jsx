import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetItemsByBranchApi } from "../../Https";

export const fetchItems = createAsyncThunk(
  "fetch/ItemDetails",
  async (payload) => {
    try {
      const response = await GetItemsByBranchApi(payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const ItemSlice = createSlice({
  name: "items",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default ItemSlice.reducer;
