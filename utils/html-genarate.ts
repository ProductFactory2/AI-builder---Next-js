import axios from "axios";

export default async function generateHtml(
  userId: string,
  projectName: string,
  finalPrompt: string
) {
  // const finalPrompt =
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
                        You are tasked with generating mutiple HTML files.

                        Instructions:
                        1. Provide multiple HTML files (at least index.html as the homepage and additional pages like products.html, formal.html, casual.html, sports.html, contact.html, and about.html).
                        2. **Output Format**: 
                        - Each file must start with the filename on a new line (e.g., "index.html").
                        - Immediately follow the filename with its corresponding HTML content.
                        - Separate each file with a newline. Do not use special characters or comments like \`<!-- index.html -->\`.
                        - every file should have tailwind cdn link    
                        - Use this format for each file:
                            filename.html
                            <html>
                            ...
                            </html>
                            
                        3. Each HTML file must contain:
                        - A header with navigation links.
                        - A main content section relevant to that page.
                        - A footer section.
                        4. **Rules**:
                        - Do not include any introductory or closing text, such as "Here are your files."
                        - Ensure the filenames and HTML content are clean and consistent with the specified format.
                        
                        Please follow the structure described and make sure each page is clearly defined.
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
    return false
  }
}







