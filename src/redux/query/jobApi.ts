import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/project`,    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
      console.log(token, "TOKEN");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, }),
  endpoints: (builder) => ({
    jobs: builder.mutation({
      query: ({page}) => {
        return {
          url: `/?page=${page || 1 }`,
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
          url: "/",
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
          url: `/${id}/`,
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
