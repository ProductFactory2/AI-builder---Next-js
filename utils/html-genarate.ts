import axios from "axios";

export default async function generateHtml(
  userId: string,
  projectName: string,
  finalPrompt: string
) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-preview",
        messages: [
          {
            role: "system",
            content: `You are tasked with generating multiple HTML files based on the provided instructions. Ensure the filenames match the link tags to enable proper navigation. Follow these guidelines:

                  1. **File Requirements**:
                   -               Generate multiple HTML files, including 'index.html' (homepage) and additional pages such as 'products.html', 'formal.html', 'casual.html', 'sports.html', 'contact.html', and 'about.html'.

                  2. **HTML Structure**:
                   - Each HTML file must:
                     - Start with the filename on a new line (e.g., index.html).
                     - Be followed by its complete HTML content.
                     - Contain a header with navigation links, a main content section, and a footer.
                     - Include the Tailwind CSS CDN for styling.
                     - Ensure the filenames are consistent with navigation links for seamless transitions between pages.

                  3. **Output Format**:
                   - Each file should use the following format:
                     filename.html
                     <html>
                     ...
                     </html>
     
                   - Separate each file with a newline. Do not use comments (e.g., <!-- index.html -->) to indicate file names.

                  4. **Content Guidelines**:
                    - Each page's content should be relevant to its title (e.g., formal.html, showcases formal clothing).
                   - Include placeholders for images, fetched from free and open-source APIs.
                   - Aim for approximately 100 lines of code per file.

                  5. **Other Notes**:
                    - Do not include introductory or closing remarks.
                    - Ensure clear and clean navigation for a cohesive user experience.
                  `,
          },
          {
            role: "user",
            content: `Generate a detailed multiple HTML file based on the following prompt and remove unwanted text. Don't use bold for filenames and give the string as output with filename: ${finalPrompt}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_API}`,
        },
      }
    );

    const code = response.data.choices[0].message.content.trim();

    const regex =
      /([a-zA-Z0-9_.-]+\.html)\n([\s\S]*?)(?=\n[a-zA-Z0-9_.-]+\.html|$)/g;

    let Data = {
      data: {
        template1: [],
      },
      userId: userId,
      projectName: projectName,
    };
    if (code.length) {
      let match;
      while ((match = regex.exec(code)) !== null) {
        const fileName = match[1].trim();
        const fileContent = match[2].trim();
        Data.data.template1.push({ [fileName]: fileContent });
      }
      console.log(`File added: `, Data);
    }

    if (Data.data.template1.length === 0) {
      console.warn("No matches found. Check the regex or API response format.");
    } else {
      await fetch("api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("dataaa", data);
        })
        .catch((err) => {
          console.log("error in ", err);
        });
      return true;
    }
  } catch (error) {
    console.log("error  ", error);
    return false;
  }
}
