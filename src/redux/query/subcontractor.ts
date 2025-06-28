import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const subcontractorApi = createApi({
  reducerPath: "subcontractorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    subcontractors: builder.mutation({
      query: (data) => {
        return {
          url: "subcontractors",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    subcontractorById: builder.mutation({
      query: ({ id }) => {
        return {
          url: `subcontractors/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createSubcontractor: builder.mutation({
      query: ({ data }) => {
        return {
          url: "subcontractors/",
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteClient: builder.mutation({
      query: (data) => {
        console.log("delet client ", data);
        return {
          url: `clients/${data?.id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data?.token}`,
          },
        };
      },
    }),
    clientDetails: builder.mutation({
      query: (data) => {
        return {
          url: `clients/${data.id}/`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    createSubcontractTask: builder.mutation({
      query: ({ data }) => {
        return {
          url: `client_new/subcontracts/`,
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            //   authorization: `bearer ${token}`,
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSubcontractorByIdMutation,
  useSubcontractorsMutation,
  useCreateSubcontractorMutation,
  useDeleteClientMutation,
  useCreateSubcontractTaskMutation,
} = subcontractorApi;
