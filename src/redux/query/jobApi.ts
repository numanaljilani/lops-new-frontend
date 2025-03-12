import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    jobs: builder.mutation({
      query: (data) => {
        return {
          url: "jobcards",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createJob: builder.mutation({
      query: (data) => {
        return {
          url: "jobcards/",
          method: "POST",
          body: data.data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteJobCard: builder.mutation({
      query: ({data , id }) => {
        console.log("delet client ", data);
        return {
          url: `jobcards/${id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data?.token}`,
          },
        };
      },
    }),
    jobDetails: builder.mutation({
      query: (data) => {
        return {
          url: `jobcards/${data.id}/`,
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
          body: data.details,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useJobDetailsMutation,
  useJobsMutation,
  useCreateJobMutation,
  useDeleteJobCardMutation,
  usePatchClientMutation,
} = jobApi;
