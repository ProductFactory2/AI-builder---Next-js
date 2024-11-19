import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  _id: string;
  name: string;
  technologies: string[];
  prompt:string
}

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    localProjects: [] as Project[],
    prompt : "Create a multi-page website for a bold and energetic streetwear sneaker brand with a cohesive red, black, and yellow color scheme. The landing page should feature high-quality images of sneakers, a strong headline, and a call-to-action section for newsletter sign-ups. The product page will showcase sneakers in a grid layout, with filtering and sorting options for size, style, and price, along with detailed descriptions and customer reviews. The about page will narrate the brand's story, highlighting its unique approach to streetwear culture and quality craftsmanship. The contact page will include a form for inquiries, store locations, and links to social media. Ensure the site is fully responsive, visually appealing, and optimized for smooth navigation across all devices, with fast loading times and a user-friendly experience."
  
  },
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.localProjects.push(action.payload);
    },
    storeprompt:(state , action: PayloadAction<Project>) =>{
      state.localProjects.prompt = action.payload
    }
  },
});

export const { addProject , storeprompt } = projectSlice.actions;
export default projectSlice.reducer;