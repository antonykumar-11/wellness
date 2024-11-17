import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vehicleRentApiSlice = createApi({
  reducerPath: "vehicleRentApi", // You can name this according to your need
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
    // Create Vehicle Rent (POST)
    createVehicleRent: builder.mutation({
      query: (newRentData) => ({
        url: "/vehicle-rent",
        method: "POST",
        body: newRentData,
      }),
    }),

    // Get All Vehicle Rents (GET)
    getVehicleRents: builder.query({
      query: () => "/vehicle-rent",
      transformResponse: (response) => {
        // Log the raw response to see its structure
        console.log("Raw response from API:", response);

        // Check if the response is an array
        if (!Array.isArray(response)) {
          throw new Error("Expected an array of vehicle rents");
        }

        // If it is an array, return it
        return response;
      },
    }),

    // Get Vehicle Rent By ID (GET)
    getVehicleRentById: builder.query({
      query: (id) => `/vehicle-rent/${id}`,
    }),

    // Update Vehicle Rent By ID (PUT)
    updateVehicleRent: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/vehicle-rent/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    // Delete Vehicle Rent By ID (DELETE)
    deleteVehicleRent: builder.mutation({
      query: (id) => ({
        url: `/vehicle-rent/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateVehicleRentMutation,
  useGetVehicleRentsQuery,
  useGetVehicleRentByIdQuery,
  useUpdateVehicleRentMutation,
  useDeleteVehicleRentMutation,
} = vehicleRentApiSlice;
