// src/features/financial/financialApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const financialApi = createApi({
  reducerPath: "financialApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/expenseexpense/",
  }),
  endpoints: (builder) => ({
    getGrossProfit: builder.query({
      query: () => "gross-profit",
    }),
    getNetProfit: builder.query({
      query: () => "net-profit",
    }),
    getBalanceSheet: builder.query({
      query: () => "balance-sheet",
    }),
  }),
});

export const {
  useGetGrossProfitQuery,
  useGetNetProfitQuery,
  useGetBalanceSheetQuery,
} = financialApi;
