import { MongoClient, GridFSBucket } from "mongodb";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const mongoURI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;
export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }
  const { data, userId, projectName } = await req.json();
  console.log("Received data:", data);
  const client = new MongoClient(mongoURI!);
  try {
    await client.connect();
    const db = client.db(databaseName);
    const bucket = new GridFSBucket(db, {
      bucketName: process.env.CREATE_PROJECT_BUCKET_NAME,
    });
    const templates = data;
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
          readableStream
            .pipe(uploadStream)
            .on("finish", () => {
              console.log(`File "${filePath}" uploaded successfully`);
              resolve(true);
            })
            .on("Error", (error) => {
              console.log(`Error uploading files "${filePath}":`, error);
              reject(error);
            });
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to uploaded files",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}