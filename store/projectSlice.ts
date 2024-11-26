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
<<<<<<< HEAD
    clearProjects: (state) => {
      state.localProjects = [];
    }
  },
  
});

export const { addProject, clearProjects } = projectSlice.actions;
=======
  },
});

export const { addProject } = projectSlice.actions;
>>>>>>> origin/M-userauth-functionalities
export default projectSlice.reducer;