import { MongoClient, GridFSBucket } from "mongodb";
import JSZip from "jszip";

const mongoURI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const projectName = searchParams.get('projectName');
    const template = searchParams.get('template');
    
    const client = new MongoClient(mongoURI!);
    const zip = new JSZip();

    try {
        await client.connect();
        const db = client.db(databaseName);
        const bucket = new GridFSBucket(db, { bucketName:process.env.CREATE_PROJECT_BUCKET_NAME });

        // Find all HTML files for this template
        const prefix = `${userId}/${projectName}/${template}/`;
        const files = await bucket.find({ 
            filename: { $regex: `^${prefix}.*\.html$` } 
        }).toArray();

        // Add each file to the zip
        for (const file of files) {
            const downloadStream = bucket.openDownloadStreamByName(file.filename);
            const chunks: Uint8Array[] = [];
            
            await new Promise((resolve, reject) => {
                downloadStream.on('data', (chunk) => chunks.push(chunk));
                downloadStream.on('error', reject);
                downloadStream.on('end', resolve);
            });

            const content = Buffer.concat(chunks).toString('utf-8');
            // Remove the prefix from filename when adding to zip
            const zipPath = file.filename.replace(prefix, '');
            zip.file(zipPath, content);
        }

        const zipContent = await zip.generateAsync({ type: "uint8array" });

        return new Response(zipContent, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${projectName}-template.zip"`,
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: "Failed to generate download" }),
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}