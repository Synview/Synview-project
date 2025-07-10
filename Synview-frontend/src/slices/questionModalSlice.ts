import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface QuestionModalState {
  commit_id: number | null;
  isOpen: boolean;
}

const initialState: QuestionModalState = {
  commit_id: null,
  isOpen: false,
};

export const questionModalSlice = createSlice({
  name: "questionModal",
  initialState,
  reducers: {
    openQuestionModal: (state, action: PayloadAction<number>) => {
      state.commit_id = action.payload
      state.isOpen = true;
    },
    closeQuestionModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openQuestionModal, closeQuestionModal } = questionModalSlice.actions;

export default questionModalSlice.reducer;
