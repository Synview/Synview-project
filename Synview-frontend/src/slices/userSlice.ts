import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../../../common/types.ts";

const initialState: User = {
  user_id: 0,
  username: "",
  email: "string",
  role: "VIEWER",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
    cleanUser(state) {
      return initialState;
    },
  },
});

export const { setUser, cleanUser } = userSlice.actions;

export default userSlice.reducer;
