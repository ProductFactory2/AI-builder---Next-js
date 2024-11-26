// / import React from "react";
// import { useSelector, } from "react-redux";

import axios from "axios";
// import { handler } from "@/app/api/model/route";
export default async function genData() {
  console.log("clicked");
//   const API_key = `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`;
//   const finalPrompt = `Create an e-commerce website design to sell shoes targeting an audience aged 14-35. The website should include the following key features:
// 1. **E-commerce Essentials**: Implement product search, user reviews, and payment gateways to facilitate easy browsing, selection, and purchase of products.
// 2. **Design and Branding**: Use a color palette of red and gold. Ensure the website reflects this branding consistently across all pages.
// 3. **Navigation Structure**: Include categories for Formal, Casual, and Sports shoes, alongside essential pages like Contact Us and About Us.
// 4. **Mobile Optimization and Accessibility**: Ensure the website is fully responsive, providing an optimal browsing experience on mobile devices. Adhere to accessibility standards to accommodate all users.
// 5. **Future Integrations**: Design the architecture to allow easy integration of third-party services like shipping and email marketing tools in the future.
// Content such as product descriptions, images, and detailed company information will be developed and added at a later stage.
// Ensure the website's design is user-friendly, visually appealing, and aligns with the latest web design trends to attract and retain the target demographic.


// `;
  let Data = {
    data: {
      templete1: {},
      templete2: {},
      templete3: {},
    },
    userId: "",
    projectName: "",
  };

  // const response = await axios.post(
  //     "https://api.openai.com/v1/chat/completions",
  //     {
  //         model: "gpt-3.5-turbo",
  //         messages: [
  //             {
  //                 role: "system",
  //                 content: `You are a web development assistant that generates comprehensive, content-rich HTML files for a multi-page website. For each HTML file, include Tailwind CSS via CDN, embedded JavaScript, and a navigation menu.`,
  //             },
  //             {
  //                 role: "user",
  //                 content: `Generate a detailed multiple html file based on the following prompt and remove unwanted text and don't use bold for filename's and hole output should be string and every htmlfile should be filename : ${finalPrompt}`,
  //                 //   content: `Generate a detailed multiple html file based on the following prompt and remove unwanted text and don't use bold for filename's and give string as output with filename: ${finalPrompt}`,
  //             },
  //         ],
  //         temperature: 0.7,
  //     },
  //     {
  //         headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${API_key}`,
  //         },
  //     }
  // );

  // console.log(response);
  // const code = response.data.choices[0].message.content.trim();
  // console.log('leeeee', code.length);

  //   const regex =/### \*{0,2}(.+?)\*{0,2}\n```html\n([\s\S]*?)\n```/g;
  //   const regex = /([a-zA-Z0-9_-]+\.html):\n```html\n([\s\S]*?)\n```/g;
  //   const regex =  /<!--\s*(\w+\.html)\s*-->/g;
  // const regex = /<!--\s*(\w+\.html)\s*-->\s*(<html[\s\S]+?<\/html>)/g;
  // const regex = /<!--\s*(\w+\.html)\s*-->([\s\S]+?)(?=\n<!--|\z)/g;
  // const files = [];

  // if (code.length) {
  //     console.log("Code content:", code);
  //     let match;
  //     while ((match = regex.exec(code)) !== null) {
  //         console.log("Match found:", match);
  //         const fileName = match[1].trim();
  //         const fileContent = match[2].trim();
  //         files.push({ [fileName]: fileContent });
  //         console.log(`File added: ${fileName}`);
  //     }
  // }

  // if (files.length === 0) {
  //     console.warn("No matches found. Check the regex or API response format.");
  // } else {
  let modeldata = JSON.stringify([
    {
      "index.html":
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>ShoeCo - Home</title>\n    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class="bg-red-500 text-white py-4">\n        <div class="container mx-auto flex justify-between items-center">\n            <h1 class="text-2xl font-bold">ShoeCo</h1>\n            <nav>\n                <a href="#" class="mr-4">Home</a>\n                <a href="products.html" class="mr-4">Products</a>\n                <a href="about.html" class="mr-4">About Us</a>\n                <a href="contact.html">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class="container mx-auto my-4">\n        <h2 class="text-3xl font-semibold">Welcome to ShoeCo</h2>\n        <p class="mt-4">Explore our wide range of stylish shoes for every occasion!</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>',
    },
    {
      "products.html":
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>ShoeCo - Products</title>\n    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class="bg-red-500 text-white py-4">\n        <div class="container mx-auto flex justify-between items-center">\n            <h1 class="text-2xl font-bold">ShoeCo</h1>\n            <nav>\n                <a href="index.html" class="mr-4">Home</a>\n                <a href="#" class="mr-4">Products</a>\n                <a href="about.html" class="mr-4">About Us</a>\n                <a href="contact.html">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class="container mx-auto my-4">\n        <h2 class="text-3xl font-semibold">Our Products</h2>\n        <p class="mt-4">Discover our collection of shoes, categorized by Formal, Casual, and Sports shoes.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>',
    },
    {
      "about.html":
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>ShoeCo - About Us</title>\n    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class="bg-red-500 text-white py-4">\n        <div class="container mx-auto flex justify-between items-center">\n            <h1 class="text-2xl font-bold">ShoeCo</h1>\n            <nav>\n                <a href="index.html" class="mr-4">Home</a>\n                <a href="products.html" class="mr-4">Products</a>\n                <a href="#" class="mr-4">About Us</a>\n                <a href="contact.html">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class="container mx-auto my-4">\n        <h2 class="text-3xl font-semibold">About ShoeCo</h2>\n        <p class="mt-4">Learn more about our mission and values as a leading shoe retailer.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>',
    },
    {
      "contact.html":
        '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>ShoeCo - Contact Us</title>\n    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class="bg-red-500 text-white py-4">\n        <div class="container mx-auto flex justify-between items-center">\n            <h1 class="text-2xl font-bold">ShoeCo</h1>\n            <nav>\n                <a href="index.html" class="mr-4">Home</a>\n                <a href="products.html" class="mr-4">Products</a>\n                <a href="about.html" class="mr-4">About Us</a>\n                <a href="#" class="mr-4">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class="container mx-auto my-4">\n        <h2 class="text-3xl font-semibold">Contact ShoeCo</h2>\n        <p class="mt-4">Get in touch with us for any inquiries or feedback.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>',
    },
  ]);
  // console.log('modeldata',modeldata);

  await fetch("api/model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: modeldata,
  })
    .then((res) => {
      console.log("resss", res);
    })
    .then((data) => {
      console.log("dataaa", data);
    })
    .catch((err) => {
      console.log("error in ", err);
    });

  // }

  // console.log("Final files:", files);

  // Log the result

  //   console.log(JSON.parse(await response.json().candidates[0].content.parts[0].text))
}

// {
//     "data": [
//         {
//             "template1": [
//                 {
//                     "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ShoeCo - Home</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-red-500 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-2xl font-bold\">ShoeCo</h1>\n            <nav>\n                <a href=\"#\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About Us</a>\n                <a href=\"contact.html\">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-4\">\n        <h2 class=\"text-3xl font-semibold\">Welcome to ShoeCo</h2>\n        <p class=\"mt-4\">Explore our wide range of stylish shoes for every occasion!</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>"
//                 },
//                 {
//                     "products.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ShoeCo - Products</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-red-500 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-2xl font-bold\">ShoeCo</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"#\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About Us</a>\n                <a href=\"contact.html\">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-4\">\n        <h2 class=\"text-3xl font-semibold\">Our Products</h2>\n        <p class=\"mt-4\">Discover our collection of shoes, categorized by Formal, Casual, and Sports shoes.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>"
//                 },
//                 {
//                     "about.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ShoeCo - About Us</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-red-500 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-2xl font-bold\">ShoeCo</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"#\" class=\"mr-4\">About Us</a>\n                <a href=\"contact.html\">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-4\">\n        <h2 class=\"text-3xl font-semibold\">About ShoeCo</h2>\n        <p class=\"mt-4\">Learn more about our mission and values as a leading shoe retailer.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>"
//                 },
//                 {
//                     "contact.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ShoeCo - Contact Us</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        /* Custom CSS can be added here */\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-red-500 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-2xl font-bold\">ShoeCo</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About Us</a>\n                <a href=\"#\" class=\"mr-4\">Contact Us</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-4\">\n        <h2 class=\"text-3xl font-semibold\">Contact ShoeCo</h2>\n        <p class=\"mt-4\">Get in touch with us for any inquiries or feedback.</p>\n    </main>\n\n    <script>\n        // Embedded JavaScript can be added here\n    </script>\n</body>\n\n</html>"
//                 }
//             ],

//             "template2": [
//                 {
//                     "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechZone - Home</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        body {\n            background: #f0f4f8;\n        }\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechZone</h1>\n            <nav>\n                <a href=\"#\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About</a>\n                <a href=\"contact.html\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-8 text-center\">\n        <h2 class=\"text-4xl font-semibold\">Innovate with TechZone</h2>\n        <p class=\"mt-6 text-lg\">Your gateway to the latest and greatest in technology.</p>\n    </main>\n</body>\n\n</html>"
//                 },
//                 {
//                     "products.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechZone - Products</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        body {\n            background: #f0f4f8;\n        }\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechZone</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"#\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About</a>\n                <a href=\"contact.html\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-8\">\n        <h2 class=\"text-3xl font-semibold\">Our Products</h2>\n        <ul class=\"mt-6 grid grid-cols-1 md:grid-cols-3 gap-6\">\n            <li class=\"bg-white p-4 shadow\">Laptops</li>\n            <li class=\"bg-white p-4 shadow\">Smartphones</li>\n            <li class=\"bg-white p-4 shadow\">Accessories</li>\n        </ul>\n    </main>\n</body>\n\n</html>"
//                 },
//                 {
//                     "about.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechZone - About</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        body {\n            background: #f0f4f8;\n        }\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechZone</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"#\" class=\"mr-4\">About</a>\n                <a href=\"contact.html\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-8\">\n        <h2 class=\"text-3xl font-semibold\">About Us</h2>\n        <p class=\"mt-6\">At TechZone, we are committed to innovation and quality in the tech industry.</p>\n    </main>\n</body>\n\n</html>"
//                 },
//                 {
//                     "contact.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechZone - Contact</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n    <style>\n        body {\n            background: #f0f4f8;\n        }\n    </style>\n</head>\n\n<body>\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechZone</h1>\n            <nav>\n                <a href=\"index.html\" class=\"mr-4\">Home</a>\n                <a href=\"products.html\" class=\"mr-4\">Products</a>\n                <a href=\"about.html\" class=\"mr-4\">About</a>\n                <a href=\"#\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto my-8\">\n        <h2 class=\"text-3xl font-semibold\">Contact Us</h2>\n        <p class=\"mt-6\">For inquiries, reach us at contact@techzone.com</p>\n    </main>\n</body>\n\n</html>"
//                 }
//             ],
//             "template3": [
//                 {
//                     "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechStore - Home</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n</head>\n\n<body class=\"bg-gray-100 text-gray-800\">\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechStore</h1>\n            <nav class=\"space-x-4\">\n                <a href=\"#\" class=\"hover:underline\">Home</a>\n                <a href=\"products.html\" class=\"hover:underline\">Products</a>\n                <a href=\"about.html\" class=\"hover:underline\">About Us</a>\n                <a href=\"contact.html\" class=\"hover:underline\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto mt-8\">\n        <div class=\"text-center\">\n            <h2 class=\"text-4xl font-semibold\">Discover Cutting-Edge Tech</h2>\n            <p class=\"mt-4 text-lg\">Explore the latest gadgets and accessories, designed for the modern lifestyle.</p>\n            <button class=\"mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700\">Shop Now</button>\n        </div>\n    </main>\n\n    <footer class=\"bg-gray-800 text-gray-300 py-4 mt-8\">\n        <div class=\"container mx-auto text-center\">\n            <p>&copy; 2024 TechStore. All rights reserved.</p>\n        </div>\n    </footer>\n</body>\n\n</html>"
//                 },
//                 {
//                     "products.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechStore - Products</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n</head>\n\n<body class=\"bg-gray-100 text-gray-800\">\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechStore</h1>\n            <nav class=\"space-x-4\">\n                <a href=\"index.html\" class=\"hover:underline\">Home</a>\n                <a href=\"#\" class=\"hover:underline\">Products</a>\n                <a href=\"about.html\" class=\"hover:underline\">About Us</a>\n                <a href=\"contact.html\" class=\"hover:underline\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto mt-8\">\n        <h2 class=\"text-4xl font-semibold\">Our Products</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-6 mt-6\">\n            <div class=\"bg-white shadow rounded p-4\">\n                <h3 class=\"text-xl font-semibold\">Smartphone</h3>\n                <p class=\"mt-2\">Latest 5G-enabled smartphones.</p>\n            </div>\n            <div class=\"bg-white shadow rounded p-4\">\n                <h3 class=\"text-xl font-semibold\">Laptop</h3>\n                <p class=\"mt-2\">High-performance laptops for professionals.</p>\n            </div>\n            <div class=\"bg-white shadow rounded p-4\">\n                <h3 class=\"text-xl font-semibold\">Smartwatch</h3>\n                <p class=\"mt-2\">Stay connected with sleek wearable tech.</p>\n            </div>\n        </div>\n    </main>\n\n    <footer class=\"bg-gray-800 text-gray-300 py-4 mt-8\">\n        <div class=\"container mx-auto text-center\">\n            <p>&copy; 2024 TechStore. All rights reserved.</p>\n        </div>\n    </footer>\n</body>\n\n</html>"
//                 },
//                 {
//                     "about.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechStore - About Us</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n</head>\n\n<body class=\"bg-gray-100 text-gray-800\">\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechStore</h1>\n            <nav class=\"space-x-4\">\n                <a href=\"index.html\" class=\"hover:underline\">Home</a>\n                <a href=\"products.html\" class=\"hover:underline\">Products</a>\n                <a href=\"#\" class=\"hover:underline\">About Us</a>\n                <a href=\"contact.html\" class=\"hover:underline\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto mt-8\">\n        <h2 class=\"text-4xl font-semibold\">About TechStore</h2>\n        <p class=\"mt-4\">TechStore is committed to bringing you the latest and greatest in technology, ensuring top quality and innovation.</p>\n    </main>\n\n    <footer class=\"bg-gray-800 text-gray-300 py-4 mt-8\">\n        <div class=\"container mx-auto text-center\">\n            <p>&copy; 2024 TechStore. All rights reserved.</p>\n        </div>\n    </footer>\n</body>\n\n</html>"
//                 },
//                 {
//                     "contact.html": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>TechStore - Contact Us</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css\" rel=\"stylesheet\">\n</head>\n\n<body class=\"bg-gray-100 text-gray-800\">\n    <header class=\"bg-blue-600 text-white py-4\">\n        <div class=\"container mx-auto flex justify-between items-center\">\n            <h1 class=\"text-3xl font-bold\">TechStore</h1>\n            <nav class=\"space-x-4\">\n                <a href=\"index.html\" class=\"hover:underline\">Home</a>\n                <a href=\"products.html\" class=\"hover:underline\">Products</a>\n                <a href=\"about.html\" class=\"hover:underline\">About Us</a>\n                <a href=\"#\" class=\"hover:underline\">Contact</a>\n            </nav>\n        </div>\n    </header>\n\n    <main class=\"container mx-auto mt-8\">\n        <h2 class=\"text-4xl font-semibold\">Contact Us</h2>\n        <p class=\"mt-4\">Reach out to us for queries, support, or feedback.</p>\n        <form class=\"mt-6\">\n            <label class=\"block mb-2\">Name</label>\n            <input type=\"text\" class=\"w-full p-2 border rounded mb-4\" placeholder=\"Your name\" />\n            <label class=\"block mb-2\">Email</label>\n            <input type=\"email\" class=\"w-full p-2 border rounded mb-4\" placeholder=\"Your email\" />\n            <label class=\"block mb-2\">Message</label>\n            <textarea class=\"w-full p-2 border rounded mb-4\" placeholder=\"Your message\"></textarea>\n            <button class=\"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700\">Submit</button>\n        </form>\n    </main>\n\n    <footer class=\"bg-gray-800 text-gray-300 py-4 mt-8\">\n        <div class=\"container mx-auto text-center\">\n            <p>&copy; 2024 TechStore. All rights reserved.</p>\n        </div>\n    </footer>\n</body>\n\n</html>"
//                 }
//             ]
//         }
//     ],
//     "userId": "6740250e55889015ad3b9ed7",
//     "projectName": "testProject",
// }
