import { MongoClient, GridFSBucket } from "mongodb";

const mongoURI = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const projectName = searchParams.get('projectName');
    
    const client = new MongoClient(mongoURI!);

    try {
        await client.connect();
        const db = client.db(databaseName);
        const bucket = new GridFSBucket(db, { bucketName: process.env.CREATE_PROJECT_BUCKET_NAME });

        // Check all possible templates
        const templates = ['template1', 'template2', 'template3'];
        for (const template of templates) {
            const filePath = `${userId}/${projectName}/${template}/index.html`;
            const files = await bucket.find({ filename: filePath }).toArray();
            
            if (files.length && files[0].metadata?.selected) {
                return new Response(JSON.stringify({
                    isSelected: true,
                    selectedTemplate: template
                }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response(JSON.stringify({
            isSelected: false,
            selectedTemplate: null
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: "Failed to check template status" }),
            { status: 500 }
        );
    } finally {
        await client.close();
    }
} 