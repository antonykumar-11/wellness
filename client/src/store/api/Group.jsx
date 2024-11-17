// services/groupApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL + "/api/v1/", // Correctly initialize fetchBaseQuery
  }),
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => "groups",
    }),
    getGroupById: builder.query({
      query: (id) => `groups/${id}`,
    }),
    createGroup: builder.mutation({
      query: (newGroup) => ({
        url: "groups",
        method: "POST",
        body: newGroup,
      }),
    }),
    updateGroup: builder.mutation({
      query: ({ id, ...updatedGroup }) => ({
        url: `groups/${id}`,
        method: "PUT",
        body: updatedGroup,
      }),
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `groups/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupApi;
