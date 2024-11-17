import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const receiptVouchersApi = createApi({
  reducerPath: "receiptVouchersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
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
    getReceiptVouchers: builder.query({
      query: () => "receipt-vouchers",
    }),
    getReceiptVoucherById: builder.query({
      query: (id) => `receipt-vouchers/${id}`,
    }),
    createReceiptVoucher: builder.mutation({
      query: (newVoucher) => ({
        url: "receipt-vouchers",
        method: "POST",
        body: newVoucher,
      }),
    }),
    updateReceiptVoucher: builder.mutation({
      query: ({ transactionId, ...voucherData }) => ({
        url: `receipt-vouchers/${transactionId}`,
        method: "PUT",
        body: voucherData,
      }),
    }),
    checkVoucherNumber: builder.query({
      query: () => `receipt-vouchers/check`,
    }),
    deleteReceiptVoucher: builder.mutation({
      query: (transactionId) => ({
        url: `receipt-vouchers/${transactionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetReceiptVouchersQuery,
  useGetReceiptVoucherByIdQuery,
  useCreateReceiptVoucherMutation,
  useUpdateReceiptVoucherMutation,
  useDeleteReceiptVoucherMutation,
  useCheckVoucherNumberQuery,
} = receiptVouchersApi;
