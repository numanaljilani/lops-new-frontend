import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: null,
  refreshToken: null, 
};

const profileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      // console.log(action.payload,"setAccessToken")
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      // console.log(action.payload,"setRefreshToken")
      state.refreshToken = action.payload;
    },  
  },
});

export const { setUser, setAccessToken, setRefreshToken } =
  profileSlice.actions;
export default profileSlice.reducer;
