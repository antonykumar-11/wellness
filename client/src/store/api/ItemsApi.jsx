// src/features/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/items`,
  }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "/get-item",
    }),
    getItem: builder.query({
      query: (id) => `/get-item/${id}`,
    }),
    createItem: builder.mutation({
      query: (newItem) => ({
        url: "/add-item",
        method: "POST",
        body: newItem,
      }),
    }),
    updateItem: builder.mutation({
      query: ({ id, updatedItem }) => ({
        url: `/edit-item/${id}`,
        method: "PUT",
        body: updatedItem,
      }),
    }),

    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/delete-item/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;

export default itemsApi;
