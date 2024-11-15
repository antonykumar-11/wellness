import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contraVouchersApi = createApi({
  reducerPath: "contraVouchersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/",
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
    getContraVouchers: builder.query({
      query: () => "contra-vouchers",
    }),
    getContraVoucherById: builder.query({
      query: (id) => `contra-vouchers/${id}`,
    }),
    createContraVoucher: builder.mutation({
      query: (newVoucher) => ({
        url: "contra-vouchers",
        method: "POST",
        body: newVoucher,
      }),
    }),
    updateContraVoucher: builder.mutation({
      query: ({ id, ...updatedVoucher }) => ({
        url: `contra-vouchers/${id}`,
        method: "PUT",
        body: updatedVoucher,
      }),
    }),
    deleteContraVoucher: builder.mutation({
      query: (id) => ({
        url: `contra-vouchers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetContraVouchersQuery,
  useGetContraVoucherByIdQuery,
  useCreateContraVoucherMutation,
  useUpdateContraVoucherMutation,
  useDeleteContraVoucherMutation,
} = contraVouchersApi;
