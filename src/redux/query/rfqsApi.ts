import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const RFQSApi = createApi({
  reducerPath: "RFQSApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/rfq`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    allRFQs: builder.mutation({
      query: ({  page , search }) => {
        console.log("Inside api", page);
        return {
          url: `/?page=${page || 1}&search=${search || ''}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    rfqs: builder.mutation({
      query: ({ quotation_number , page }) => {
        return {
          url: `/?page=${page || 1}`,
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
          url: "/",
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
          url: `/${data.rfq_id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteRfq: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `rfqs/${id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    updateRFQ: builder.mutation({
      query: ({ id, data }) => {
        console.log(data);
        return {
          url: `/${id}`,
          method: "PUT",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdateRFQMutation,
  useAllRFQsMutation,
  useRFQDetailsMutation,
  useRfqsMutation,
  useCreateRFQMutation,
  useDeleteRfqMutation,
} = RFQSApi;
