import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockGroupApi = createApi({
  reducerPath: "stockGroupApi",

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
    // Fetch all stock groups
    getStockGroups: builder.query({
      query: () => "stocks/createStockGroup", // Update with the correct endpoint
    }),
    // Fetch a stock group by ID
    getStockGroupById: builder.query({
      query: (id) => `stocks/createStockGroup/${id}`,
    }),
    // Create a new stock group
    createStockGroup: builder.mutation({
      query: (newGroup) => ({
        url: "stocks/createStockGroup",
        method: "POST",
        body: newGroup,
      }),
    }),
    // Update an existing stock group
    updateStockGroup: builder.mutation({
      query: ({ id, updatedGroup }) => ({
        url: `stocks/createStockGroup/${id}`,
        method: "PUT",
        body: updatedGroup,
      }),
    }),
    // Delete a stock group
    deleteStockGroup: builder.mutation({
      query: (id) => ({
        url: `stocks/createStockGroup/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetStockGroupsQuery,
  useGetStockGroupByIdQuery,
  useCreateStockGroupMutation,
  useUpdateStockGroupMutation,
  useDeleteStockGroupMutation,
} = stockGroupApi;
