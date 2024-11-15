// src/store/api/StockApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockItemsApi = createApi({
  reducerPath: "stockItemsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/stocks",
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
    getStockItems: builder.query({
      query: () => "/stock-items",
    }),
    getStockItemById: builder.query({
      query: (id) => `/stock-items/${id}`,
    }),
    createStockItem: builder.mutation({
      query: (newStockItem) => ({
        url: "/stock-items",
        method: "POST",
        body: newStockItem,
      }),
    }),
    updateStockItem: builder.mutation({
      query: ({ id, ...updatedStockItem }) => ({
        url: `/stock-items/${id}`,
        method: "PUT",
        body: updatedStockItem,
      }),
    }),
    deleteStockItem: builder.mutation({
      query: (id) => ({
        url: `/stock-items/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetStockItemsQuery,
  useGetStockItemByIdQuery,
  useCreateStockItemMutation,
  useUpdateStockItemMutation,
  useDeleteStockItemMutation,
} = stockItemsApi;
