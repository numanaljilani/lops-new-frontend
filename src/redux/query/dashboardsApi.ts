import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { urls } from '@/constants/urls';
// import { URLS } from '../../constants/urls';


// Define a service using a base URL and expected endpoints
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  // 192.168.242.213
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
  
      adminDashboard: builder.mutation({
        query: (user) => {
          return {
            url: "/admin",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      changePassword: builder.mutation({
        query: ({password , confirm_password}) => {
          console.log(password , "PASSWORD")
          return {
            url: "password",
            method: "PUT",
            body: {password , confirm_password},
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      profile: builder.mutation({
        query: () => {
          return {
            url: "profile",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
             
            },
          };
        },
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAdminDashboardMutation ,useProfileMutation , useChangePasswordMutation } = dashboardApi