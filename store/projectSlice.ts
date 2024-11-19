import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  _id: string;
  name: string;
  technologies: string[];
}

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    localProjects: [] as Project[],
  },
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.localProjects.push(action.payload);
    },
  },
});

export const { addProject } = projectSlice.actions;
export default projectSlice.reducer;