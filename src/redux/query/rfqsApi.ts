import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const RFQSApi = createApi({
  reducerPath: 'RFQSApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    allRFQs: builder.mutation({
        query: (data) => {
          return {
            url: "rfqs",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    rfqs: builder.mutation({
        query: (data) => {
          return {
            url: "rfqs",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createRFQ: builder.mutation({
        query: (data) => {
          return {
            url: "rfqs/",
            method: "POST",
            body: data.data,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    RFQDetails: builder.mutation({
        query: (data) => {
          return {
            url: `rfqs/${data.rfq_id}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      deleteClient: builder.mutation({
        query: (data) => {
          return {
            url: `companies/${data?.id}/`,
            method: "Delete",
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
      patchClient: builder.mutation({
        query: (data) => {
          return {
            url: `companies/${data.id}/`,
            method: "PATCH",
            body : data.details,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${data.token}`,
            },
          };
        },
      }),




  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useClientDetailsMutation ,useAllRFQsMutation,useRFQDetailsMutation, useRfqsMutation , useCreateRFQMutation , useDeleteClientMutation , usePatchClientMutation } = RFQSApi