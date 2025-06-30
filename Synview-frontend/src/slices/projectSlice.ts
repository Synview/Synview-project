import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface Project {
  ProjectId: number;
  title: string;
  description: string;
  owner_id: number;
  repo_url: string;
  doc_url: string;
  created_at: Date;
}
interface Projects {
  projects: Project[];
}
const initialState: Projects = {
  projects: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
  },
});

export const { addProject } = projectSlice.actions;

export default projectSlice.reducer
