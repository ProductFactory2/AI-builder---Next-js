// import React from "react";
// import { useSelector, } from "react-redux";

// function Generatedata() {

//   console.log(globalData);
//   return (<>
//              <h1>ssdsd</h1>

//     </>)
// }

// export default Generatedata;
export default async function genData(finalPrompt: any, API_key: string) {
    const enhancedPrompt = `Generate a modern, responsive, and professional website using separate HTML5, CSS3 with Tailwind, and JavaScript for the following prompt: "${finalPrompt}". Ensure the generated code is structured, fully functional, and visually appealing. Follow the detailed instructions below for each component:
  
    Frontend Instructions:
    1. HTML:
       - Use semantic HTML5 elements (header, nav, main, section, article, aside, footer) appropriately.
       - Include a responsive navigation menu.
       - Implement a logical content structure with a clear hierarchy.
       - Add appropriate Bootstrap 5 classes for layout and components.
       - Include necessary meta tags, title, and links to CSS and JS files.
       - Ensure the structure accommodates all content requirements from the prompt.
       - Use ARIA attributes where necessary for accessibility.
       - Use Tailwind CSS for styling.
       - Include tailwind CDN in the head section of the HTML file.
    
    2. CSS:
       - Include styling for all elements in the HTML file.
       - Create a separate CSS file with a professional, modern design.
       - Implement a cohesive color scheme using CSS variables.
       - Utilize Flexbox and/or CSS Grid for layouts.
       - Incorporate responsive design principles, including a mobile-first approach.
       - Use Tailwind-inspired utility classes for common styling patterns.
       - Implement custom animations and transitions for interactive elements.
       - Ensure typography is clear and readable across devices.
       - Override and extend Bootstrap styles to create a unique look.
       - Use media queries to fine-tune responsiveness.
       - Optimize for performance by minimizing redundant styles.
    
    3. JavaScript:
       - Create a separate JavaScript file.
       - Implement form validation for all input fields.
       - Add event listeners for user interactions (clicks, hovers, submits).
       - Create functions to handle any required data processing.
       - Implement DOM manipulation for dynamic content updates.
       - Ensure smooth animations and transitions where applicable.
       - Add error handling and user feedback mechanisms.
       - Implement any specific functionality mentioned in the prompt.
       - Use modern ES6+ syntax and best practices.
       - Ensure the script is non-blocking and optimized for performance.
    
    Backend Instructions (MongoDB Integration):
    1. Models:
       - Define MongoDB models with Mongoose based on the specific requirements from the prompt.
       - Ensure that each model includes appropriate schema validations, references, and relationships.
       - Create model methods for complex queries if necessary.
       
    2. Controllers:
       - Write controllers to handle CRUD operations based on the MongoDB models.
       - Implement logic for processing data, including data validation, filtering, and pagination.
       - Add error handling and return appropriate responses for success and failure scenarios.
    
    3. Routes:
       - Define Express.js routes to handle incoming HTTP requests and connect them to the appropriate controllers.
       - Ensure that routes are well-structured and follow RESTful principles.
       - Use route middlewares for authentication, authorization, and any other necessary middleware functions.
    
    General Guidelines:
    - Ensure all code is valid, well-formatted, and follows best practices.
    - Implement responsive design principles throughout all components.
    - Optimize for accessibility and performance.
    - Use comments to explain complex code sections.
    - Ensure cross-browser compatibility.
    - Implement error handling and graceful degradation.
    
    Output Format:
    - Generate the following outputs:
      - HTML, CSS, and JavaScript Code
      - MongoDB Models
      - Controllers
      - Routes
     
    Output format:
    ---HTML---
    [Your generated HTML code here]
    ---CSS---
    [Your generated CSS code here]
    ---JavaScript---
    [Your generated JavaScript code here]
    ---Models---
    [Your generated MongoDB models here]
    ---Controllers---
    [Your generated controllers here]
    ---Routes---
    [Your generated routes here]
    ---END---`;
    
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
    
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: enhancedPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 99999999,
            }
          })
        });
    
       
        console.log(response)
  

  console.log(JSON.parse(await response.json().candidates[0].content.parts[0].text))
}
