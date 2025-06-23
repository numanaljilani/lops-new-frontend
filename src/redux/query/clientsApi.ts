import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery, RootState } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/client` , 
  prepareHeaders :(headers, { getState }) =>{
     const token = (getState() as any);
     console.log(token , "TOKEN")
  }
  }),
  
  endpoints: (builder) => ({
    clients: builder.mutation({
        query: ({page}) => {
          return {
            url: `/?page=${page || 1}`,
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
            url: "/",
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
            url: `/${data?.id}/`,
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
            url: `/${data.id}/`,
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
            url: `/${data.id}/`,
            method: "PUT",
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