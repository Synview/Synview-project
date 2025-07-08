import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface githubModalState {
  project_id: number | undefined;
  user_id: number | undefined;
  isOpen: boolean;
}

const initialState: githubModalState = {
  user_id: 0,
  project_id: 0,
  isOpen: false,
};

export const githubModalSlice = createSlice({
  name: "githubModal",
  initialState,
  reducers: {
    openGithubModal: (state, action: PayloadAction<githubModalState>) => {
      state.project_id = action.payload.project_id;
      state.user_id = action.payload.user_id;
      state.isOpen = action.payload.isOpen;
    },
    closGithubModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openGithubModal, closGithubModal } = githubModalSlice.actions;

export default githubModalSlice.reducer;
