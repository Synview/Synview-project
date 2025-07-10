import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface GithubModalState {
  project_id: number 
  user_id: number 
  isOpen: boolean;
}

const initialState: GithubModalState = {
  user_id: 0,
  project_id: 0,
  isOpen: false,
};

export const githubModalSlice = createSlice({
  name: "githubModal",
  initialState,
  reducers: {
    openGithubModal: (state, action: PayloadAction<GithubModalState>) => {
      state.project_id = action.payload.project_id;
      state.user_id = action.payload.user_id;
      state.isOpen = action.payload.isOpen;
    },
    closeGithubModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openGithubModal, closeGithubModal } = githubModalSlice.actions;

export default githubModalSlice.reducer;
