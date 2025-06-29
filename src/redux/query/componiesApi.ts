import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const companiesApi = createApi({
  reducerPath: "companiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/company`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    componies: builder.mutation({
      query: ({ page ,search}) => {
        console.log("inside componies ");
        return {
          // url: `/?page=${page || 1 }`,
          url: `/?page=${page || 1}&search=${search || ''}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createCompany: builder.mutation({
      query: (data) => {
        return {
          url: "/",
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteCompany: builder.mutation({
      query: (data) => {
        return {
          url: `${data?.id}/`,
          method: "Delete",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data?.token}`,
          },
        };
      },
    }),
    companyDetails: builder.mutation({
      query: (data) => {
        console.log(data, "companyDetails api");
        return {
          url: `/${data.id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    patchCompany: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}/`,
          method: "PUT",
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
  useDeleteCompanyMutation,
  useComponiesMutation,
  useCreateCompanyMutation,
  useCompanyDetailsMutation,
  usePatchCompanyMutation,
} = companiesApi;
