// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id : null,
  username: "",
  name: "",
  email: "",
  bio: "",
  skills: [],
  github: "",
  website: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetProfile: () => initialState,
  },
});

export const { updateProfile, resetProfile } = userSlice.actions;
export default userSlice.reducer;
