import { MongoClient, GridFSBucket } from "mongodb";

const mongoURI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

export async function GET(
  req: Request,
  { params }: { params: { userId: string; projectName: string; template: string; path: string[] } }
) {
  const { userId, projectName, template, path } = params;
  const client = new MongoClient(mongoURI!);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const bucket = new GridFSBucket(db, { bucketName: process.env.CREATE_PROJECT_BUCKET_NAME });

    // If path is empty or undefined, default to index.html
    const fileName = path?.length ? path.join('/') : 'index.html';
    const filePath = `${userId}/${projectName}/${template}/${fileName}`;
    
    console.log('Requesting file:', filePath);

    const files = await bucket.find({ filename: filePath }).toArray();
    
    if (!files.length) {
      console.log('File not found:', filePath);
      return new Response("File not found", { status: 404 });
    }

    // Download and get content
    const downloadStream = bucket.openDownloadStreamByName(filePath);
    const chunks: Uint8Array[] = [];
    
    await new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', resolve);
    });

    let content = Buffer.concat(chunks).toString('utf-8');

    // Transform relative links to absolute API routes
    content = content.replace(
      /href=["'](.*?\.html)["']/g,
      (match, link) => {
        // Remove leading ./ or / if present
        const cleanLink = link.replace(/^\.?\//, '');
        return `href="/api/preview/${userId}/${projectName}/${template}/${cleanLink}"`;
      }
    );

    return new Response(content, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch content" }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}