// src/api/paymasterApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PaymasterApi = createApi({
  reducerPath: "paymasterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/", // Corrected the URL
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources
      console.log("token", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllPaymasterVouchers: builder.query({
      query: () => "paymaster",
    }),
    getAllPaymasterIndirectExpenses: builder.query({
      query: () => "expenseexpense/assets",
    }),
    getPaymasterVoucherById: builder.query({
      query: (id) => `paymaster/${id}`, // Added a slash before the id
    }),
    createPaymasterVoucher: builder.mutation({
      query: (newPaymasterVoucher) => ({
        url: "paymaster",
        method: "POST",
        body: newPaymasterVoucher,
      }),
    }),
    checkVoucherNumber: builder.query({
      query: () => `paymaster/check`,
    }),
    updatePaymasterVoucher: builder.mutation({
      query: ({ id, ...updatedPaymasterVoucher }) => ({
        url: `paymaster/${id}`,
        method: "PUT",
        body: updatedPaymasterVoucher,
      }),
    }),
    deletePaymasterVoucher: builder.mutation({
      query: (id) => ({
        url: `paymaster/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllPaymasterIndirectExpensesQuery,
  useCheckVoucherNumberQuery,
  useGetAllPaymasterVouchersQuery,
  useGetPaymasterVoucherByIdQuery,
  useCreatePaymasterVoucherMutation,
  useUpdatePaymasterVoucherMutation,
  useDeletePaymasterVoucherMutation,
} = PaymasterApi;
