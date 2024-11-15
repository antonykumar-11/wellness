import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  tagTypes: ["Stock"],
  endpoints: (builder) => ({
    getAllStocks: builder.query({
      query: () => ({
        url: "stocks",
        method: "GET",
      }),
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) {
          return [{ type: "Stock", id: "LIST" }];
        }
        return [
          ...result.map(({ _id }) => ({ type: "Stock", id: _id })),
          { type: "Stock", id: "LIST" },
        ];
      },
    }),
    getStockById: builder.query({
      query: (id) => ({
        url: `stocks/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Stock", id: result._id }] : [],
    }),
    createStock: builder.mutation({
      query: (newStock) => ({
        url: "stocks",
        method: "POST",
        body: newStock,
      }),
      invalidatesTags: [{ type: "Stock", id: "LIST" }],
    }),
    updateStock: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `stocks/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Stock", id }],
    }),
    deleteStock: builder.mutation({
      query: (stockId) => ({
        url: `stocks/${stockId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, stockId) => [
        { type: "Stock", id: stockId },
      ],
    }),
  }),
});

export const {
  useGetAllStocksQuery,
  useGetStockByIdQuery, // Export the hook for getting stock by ID
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;

export default stockApi;
