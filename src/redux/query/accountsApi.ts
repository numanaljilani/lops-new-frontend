import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const accountsApi = createApi({
  reducerPath: 'accountsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    paymentBallsList: builder.mutation({
        query: (data) => {
          return {
            url: "accounts/payment-balls/?verification_status=&project_status=&project_percentage=100",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    VerifyPaymentStatus: builder.mutation({
        query: ({data , id }) => {
          console.log(data , id , "API")
          return {
            url: `accounts/payment-balls/${id}/`,
            method: "PUT",
            body: data,
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
      accountsDetails: builder.mutation({
        query: (data) => {
          return {
            url: `accounts/payment-balls/${data.id}/`,
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
export const { useAccountsDetailsMutation , usePaymentBallsListMutation , useVerifyPaymentStatusMutation , useDeleteClientMutation , usePatchClientMutation } = accountsApi