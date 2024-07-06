import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetArticlesByBranchApi, GetCompanyApi } from "../../Https";

export const fetchArticles = createAsyncThunk(
  "fetch/ArticlesDetails",
  async (branch_no) => {
    try {
      const response = await GetArticlesByBranchApi(branch_no);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

const ArticleSlice = createSlice({
  name: "articles",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default ArticleSlice.reducer;
