import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const salesVouchersApi = createApi({
  reducerPath: "salesVouchersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState()?.auth?.user?.token || localStorage.getItem("token");
      console.log("Token used:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all sales vouchers
    getSalesVouchers: builder.query({
      query: () => "sales-vouchers",
    }),

    // Fetch a sales voucher by ID
    getSalesVoucherById: builder.query({
      query: (id) => `sales-vouchers/${id}`,
    }),

    // Check for voucher number (GET request)
    checkVoucherNumber: builder.query({
      query: () => `sales-vouchers/check`,
    }),

    // Check for multiple voucher numbers (POST request with data)
    checkVoucherNumbers: builder.query({
      query: (purchaseData) => {
        console.log("Checking purchase data:", purchaseData);
        return {
          url: `sales-vouchers/checks`,
          method: "POST",
          body: { thisPurchase: purchaseData },
        };
      },
    }),

    // Create a new sales voucher (POST request)
    createSalesVoucher: builder.mutation({
      query: (newVoucher) => ({
        url: "sales-vouchers",
        method: "POST",
        body: newVoucher,
      }),
    }),

    // Update an existing sales voucher (PUT request)
    updateSalesVoucher: builder.mutation({
      query: ({ transactionId, updatedPayment }) => ({
        url: `sales-vouchers/${transactionId}`,
        method: "PUT",
        body: updatedPayment,
      }),
    }),

    // Delete a sales voucher (DELETE request)
    deleteSalesVoucher: builder.mutation({
      query: (transactionId) => ({
        url: `sales-vouchers/${transactionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for each query and mutation
export const {
  useGetSalesVouchersQuery,
  useGetSalesVoucherByIdQuery,
  useCheckVoucherNumberQuery,
  useCheckVoucherNumbersQuery,
  useCreateSalesVoucherMutation,
  useUpdateSalesVoucherMutation,
  useDeleteSalesVoucherMutation,
} = salesVouchersApi;
