import { MongoClient, GridFSBucket } from "mongodb";
import { Readable } from "stream";
const mongoURI = "mongodb://localhost:27017";
const databaseName = "ai-builder";
export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }
  const {data, userId, projectName} = await req.json();
  console.log("Received data:", data);
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db(databaseName);
    const bucket = new GridFSBucket(db, { bucketName: "projects" });
    const templates = data[0];
    for (const templateKey of Object.keys(templates)) {
      const templateFiles = templates[templateKey];
      //process each file in the template
      for (const fileObj of templateFiles) {
        const fileName = Object.keys(fileObj)[0];
        const fileContent = fileObj[fileName];
        //Create the file path with the specified structure
        const filePath = `${userId}/${projectName}/${templateKey}/${fileName}`;
        //create a readable stream from the file content
        const readableStream = new Readable();
        readableStream.push(fileContent);
        readableStream.push(null); //End the stream
        await new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStream(filePath);
          readableStream.pipe(uploadStream)
            .on("finish", () => {
              console.log(`File "${filePath}" uploaded successfully`);
              resolve();
            })
            .on("Error", (error) => {
              console.log(`Error uploading files "${filePath}":`, error);
              reject(error)
            })
        })
      }
    }
    return new Response(
      JSON.stringify({
        message: "Files uploaded successfully",
        details: {
          userId,
          projectName,
          templateProcessed: Object.keys(data[0])
        }
      }),
      {status: 200}
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to uploaded files",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {status: 500}
    );
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}