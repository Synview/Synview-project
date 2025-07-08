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
    open: (state, action: PayloadAction<number>) => {
      state.commit_id = action.payload
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = questionModalSlice.actions;

export default questionModalSlice.reducer;
