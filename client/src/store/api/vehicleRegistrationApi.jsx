import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base API service
export const vehicleRegistrationApi = createApi({
  reducerPath: "vehicleRegistrationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
  }),
  endpoints: (builder) => ({
    // Fetch all vehicle registrations
    getAllVehicleRegistrations: builder.query({
      query: () => "vehicle-registrations",
    }),
    // Fetch a single vehicle registration by ID
    getVehicleRegistrationById: builder.query({
      query: (id) => `vehicle-registrations/${id}`,
    }),
    // Create a new vehicle registration
    createVehicleRegistration: builder.mutation({
      query: (newVehicleRegistration) => ({
        url: "vehicle-registrations",
        method: "POST",
        body: newVehicleRegistration,
      }),
    }),
    // Update a vehicle registration by ID
    updateVehicleRegistration: builder.mutation({
      query: ({ groupId, ...updatedVehicleRegistration }) => ({
        url: `vehicle-registrations/${groupId}`,
        method: "PUT",
        body: updatedVehicleRegistration,
      }),
    }),
    // Delete a vehicle registration by ID
    deleteVehicleRegistration: builder.mutation({
      query: (groupId) => ({
        url: `vehicle-registrations/${groupId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllVehicleRegistrationsQuery,
  useGetVehicleRegistrationByIdQuery,
  useCreateVehicleRegistrationMutation,
  useUpdateVehicleRegistrationMutation,
  useDeleteVehicleRegistrationMutation,
} = vehicleRegistrationApi;
