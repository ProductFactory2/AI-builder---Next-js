import { MongoClient, GridFSBucket } from "mongodb";

const mongoURI = "mongodb://localhost:27017";
const databaseName = "ai-builder";

export async function POST(req: Request) {
  const { userId, projectName, selectedTemplate } = await req.json();
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const bucket = new GridFSBucket(db, { bucketName: "projects" });
    const rejectedBucket = new GridFSBucket(db, { bucketName: "rejected" });

    // Get all template files for this project
    const templates = ['template1', 'template2', 'template3'];
    
    for (const template of templates) {
      const filePath = `${userId}/${projectName}/${template}/index.html`;
      const files = await bucket.find({ filename: filePath }).toArray();
      
      if (files.length) {
        if (template === selectedTemplate) {
          // Update metadata for selected template
          await db.collection('projects.files').updateOne(
            { filename: filePath },
            { $set: { "metadata.selected": true } }
          );
        } else {
          // Move other templates to rejected bucket
          const downloadStream = bucket.openDownloadStreamByName(filePath);
          const uploadStream = rejectedBucket.openUploadStream(filePath);
          
          await new Promise((resolve, reject) => {
            downloadStream.pipe(uploadStream)
              .on('finish', resolve)
              .on('error', reject);
          });

          // Delete from original bucket
          await bucket.delete(files[0]._id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to select template" }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}