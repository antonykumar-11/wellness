// src/features/api/paymentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,

    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources
      console.log("token", token); // Log the token for debugging
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => "/payments",
    }),
    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
    }),
    createPayment: builder.mutation({
      query: (newPayment) => ({
        url: "/payments",
        method: "POST",
        body: newPayment,
      }),
    }),
    checkVoucherNumber: builder.query({
      query: () => `/payments/check`,
    }),
    updatePayment: builder.mutation({
      query: ({ transactionId, ...voucherData }) => ({
        url: `/payments/${transactionId}`, // Ensure this matches your route
        method: "PUT",
        body: voucherData, // This should include updatedPurchase
      }),
    }),

    deletePayment: builder.mutation({
      query: (transactionId) => {
        console.log(
          `Preparing to delete payment with transactionId: ${transactionId}`
        ); // Log the transaction ID
        return {
          url: `/payments/${transactionId}`, // URL to delete the payment
          method: "DELETE", // HTTP method
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useCheckVoucherNumberQuery,
} = paymentApi;
