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
        query: ({admin}) => {
          return {
            url: `/admin`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      userDashboard: builder.mutation({
        query: ({admin}) => {
          return {
            url: `/user`,
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
export const { useAdminDashboardMutation ,useUserDashboardMutation } = dashboardApi