import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",

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
    createPurchase: builder.mutation({
      query: (newPurchase) => ({
        url: "purchases",
        method: "POST",
        body: newPurchase,
      }),
    }),
    checkVoucherNumber: builder.query({
      query: () => `purchases/check`,
    }),
    checkVoucherNumbers: builder.query({
      query: ({ thisPurchase, status }) => {
        console.log("Sending purchaseData to the backend:", {
          thisPurchase,
          status,
        });

        return {
          url: `purchases/checks`,
          method: "POST", // Use POST to send data
          body: { thisPurchase, status }, // Send `thisPurchase` and `status`
        };
      },
    }),

    getPurchases: builder.query({
      query: () => "purchases",
    }),
    getPurchasesSome: builder.query({
      query: () => `purchases/some`,
    }),
    getPurchaseById: builder.query({
      query: (id) => {
        console.log("ID passed to query:", id); // Log the ID here
        return `purchases/${id}`; // Return the API endpoint
      },
    }),
    updatePurchase: builder.mutation({
      query: ({ updatedPurchase, transactionId }) => {
        return {
          url: `purchases/${transactionId}`,
          method: "PUT",
          body: updatedPurchase,
        };
      },
    }),

    deletePurchase: builder.mutation({
      query: (id) => {
        console.log("Deleting purchase with ID:", id); // Log the ID to the console
        return {
          url: `purchases/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetPurchasesQuery,
  useGetPurchasesSomeQuery,
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useCheckVoucherNumberQuery,
  useCheckVoucherNumbersQuery,
} = purchaseApi;
