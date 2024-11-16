import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockCategoryApi = createApi({
  reducerPath: "stockCategoryApi",
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
    // Fetch all stock categories
    getStockCategories: builder.query({
      query: () => "stocks/createStockCategory",
    }),
    // Fetch a stock category by ID
    getStockCategoryById: builder.query({
      query: (id) => `stocks/createStockCategory/${id}`,
    }),
    // Create a new stock category
    createStockCategory: builder.mutation({
      query: (newCategory) => ({
        url: "stocks/createStockCategory",
        method: "POST",
        body: newCategory,
      }),
    }),
    // Update an existing stock category
    updateStockCategory: builder.mutation({
      query: ({ id, updatedCategory }) => ({
        url: `stocks/createStockCategory/${id}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),
    // Delete a stock category
    deleteStockCategory: builder.mutation({
      query: (id) => ({
        url: `stocks/createStockCategory/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetStockCategoriesQuery,
  useGetStockCategoryByIdQuery,
  useCreateStockCategoryMutation,
  useUpdateStockCategoryMutation,
  useDeleteStockCategoryMutation,
} = stockCategoryApi;
