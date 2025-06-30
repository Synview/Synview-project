import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  role: string;
  id: number;
}
const initialState: UserState = {
  username: "Ghast",
  role: "user",
  id: -1,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.username = action.payload.username;
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer