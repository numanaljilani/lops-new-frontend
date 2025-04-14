import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    clients: builder.mutation({
        query: ({page}) => {
          return {
            url: `clients/?page=${page || 1}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createClient: builder.mutation({
        query: (data) => {
          return {
            url: "clients/",
            method: "POST",
            body: data.data,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      deleteClient: builder.mutation({
        query: (data) => {
          console.log("delet client ",data)
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
      patchClient: builder.mutation({
        query: (data) => {
          return {
            url: `clients/${data.id}/`,
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
export const { useClientDetailsMutation , useClientsMutation , useCreateClientMutation , useDeleteClientMutation , usePatchClientMutation } = clientsApi