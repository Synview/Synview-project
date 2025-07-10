import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface InviteMentorState {
  project_id: number;
  user_id: number;
  isOpen: boolean;
}

const initialState: InviteMentorState = {
  user_id: 0,
  project_id: 0,
  isOpen: false,
};

export const inviteMentorSlice = createSlice({
  name: "inviteMentorModal",
  initialState,
  reducers: {
    openInviteMentorModal: (
      state,
      action: PayloadAction<InviteMentorState>
    ) => {
      state.project_id = action.payload.project_id;
      state.user_id = action.payload.user_id;
      state.isOpen = action.payload.isOpen;
    },
    closeInviteMentorModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openInviteMentorModal, closeInviteMentorModal } =
  inviteMentorSlice.actions;

export default inviteMentorSlice.reducer;
