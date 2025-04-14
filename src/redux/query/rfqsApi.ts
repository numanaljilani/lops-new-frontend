import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const RFQSApi = createApi({
  reducerPath: 'RFQSApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    allRFQs: builder.mutation({
        query: ({quotation_number , page }) => {
          console.log("Inside api" , page )
          return {
            url: `rfqs/?page=${page ||"" }&${quotation_number && `quotation_number=`+ quotation_number}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    rfqs: builder.mutation({
        query: ({quotation_number}) => {
          return {
            url: `rfqs`,
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
      deleteRfq: builder.mutation({
        query: ({data , id }) => {
          return {
            url: `rfqs/${id}/`,
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${data?.token}`,
            },
          };
        },
      }),
      updateRFQ: builder.mutation({
        query: ({id , data , token }) => {
          console.log(data)
          return {
            url: `rfqs/${id}/`,
            method: "PUT",
            body : data,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${token}`,
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
export const { useUpdateRFQMutation ,useAllRFQsMutation,useRFQDetailsMutation, useRfqsMutation , useCreateRFQMutation , useDeleteRfqMutation , usePatchClientMutation } = RFQSApi