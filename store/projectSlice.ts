import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileData {
  fileName: string;
  fileData: string;
  fileType: string;
}

interface Project {
  _id: string;
  name: string;
  technologies: string[];
  local_name: string;
  fileData?: FileData;
  finalPrompt?: string;
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
    clearProjects: (state) => {
      state.localProjects = [];
    },
    updateProjectData: (state, action: PayloadAction<{ fileData?: FileData; finalPrompt?: string }>) => {
      if (state.localProjects.length > 0) {
        const project = state.localProjects[0];
        if (action.payload.fileData) {
          project.fileData = action.payload.fileData;
        }
        if (action.payload.finalPrompt) {
          project.finalPrompt = action.payload.finalPrompt;
        }
      }
    },
  },
});

export const { addProject, clearProjects, updateProjectData } = projectSlice.actions;
export default projectSlice.reducer;