import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeegroupsApi = createApi({
  reducerPath: "employeegroupsApi",
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
  tagTypes: ["EmployeeGroup"],
  endpoints: (builder) => ({
    // Fetch all employee groups
    fetchEmployeeGroups: builder.query({
      query: () => "employeegroups",
      providesTags: ["EmployeeGroup"],
    }),
    // Fetch a single employee group by id
    fetchEmployeeGroupById: builder.query({
      query: (id) => `employeegroups/${id}`,
      providesTags: (result) =>
        result ? [{ type: "EmployeeGroup", id: result.id }] : [],
    }),
    // Create a new employee group
    createEmployeeGroup: builder.mutation({
      query: (newEmployeeGroup) => ({
        url: "employeegroups",
        method: "POST",
        body: newEmployeeGroup,
      }),
      invalidatesTags: ["EmployeeGroup"],
    }),
    // Update an existing employee group
    updateEmployeeGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `employeegroups/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: "EmployeeGroup", id: result.id }],
    }),
    // Delete an employee group
    deleteEmployeeGroup: builder.mutation({
      query: (id) => ({
        url: `employeegroups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [{ type: "EmployeeGroup", id: result.id }],
    }),
  }),
});

export const {
  useFetchEmployeeGroupsQuery,
  useFetchEmployeeGroupByIdQuery,
  useCreateEmployeeGroupMutation,
  useUpdateEmployeeGroupMutation,
  useDeleteEmployeeGroupMutation,
} = employeegroupsApi;
