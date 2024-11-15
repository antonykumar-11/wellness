import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicePurchaseApi = createApi({
  reducerPath: "servicePurchaseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/services/",
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
      query: (purchaseData) => {
        console.log("Sending purchaseData to the backend:", purchaseData); // Log the purchaseData being sent

        return {
          url: `purchases/checks`,
          method: "POST", // Use POST to send data
          body: { thisPurchase: purchaseData }, // Send only `thisPurchase` or full `purchaseData`
        };
      },
    }),
    getPurchases: builder.query({
      query: () => "purchases",
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
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useCheckVoucherNumberQuery,
  useCheckVoucherNumbersQuery,
} = servicePurchaseApi;
