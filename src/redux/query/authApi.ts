import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { urls } from '@/constants/urls';
// import { URLS } from '../../constants/urls';


// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  // 192.168.242.213
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
  
      login: builder.mutation({
        query: (user) => {
          return {
            url: "login",
            method: "POST",
            body: user,
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
export const { useLoginMutation ,useProfileMutation } = authApi