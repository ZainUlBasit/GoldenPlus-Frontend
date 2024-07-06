import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetCompanyApi } from "../../Https";

export const fetchCompanies = createAsyncThunk(
  "fetch/CompanyDetails",
  async (payload) => {
    try {
      const response = await GetCompanyApi(payload);
      console.log(response.data);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
    }
    return [];
  }
);

// export const fetchAdminNotification = createAsyncThunk(
//   "fetchAdminNotification",
//   async (query = {}) => {
//     let response;
//     try {
//       response = await GetAdminNotificationApi({});
//       console.log(response);
//       console.log(response.data.data);
//       console.log(response.data.data.payload);
//       return response?.data?.data?.payload || response.data.data;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

const CompanySlice = createSlice({
  name: "company",
  initialState: {
    loading: true,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCompanies.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      console.log("Error", action);
      // console.log("Error", action.payload);
      state.loading = false;
      state.isError = true;
    });
  },
});

export default CompanySlice.reducer;
