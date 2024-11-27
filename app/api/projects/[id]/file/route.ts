import { NextResponse } from 'next/server';
import Project from '@/models/project';
import connectMongoDB from '@/lib/mongodb';

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    await connectMongoDB();
    const { id } = context.params;
    
    const project = await Project.findById(id);
    if (!project?.referenceFile) {
      return new Response('File not found', { status: 404 });
    }

    // Convert base64 to binary
    const binaryData = Buffer.from(project.referenceFile.fileData, 'base64');

    return new Response(binaryData, {
      headers: {
        'Content-Type': project.referenceFile.fileType,
        'Content-Disposition': `inline; filename="${project.referenceFile.fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new Response('Error fetching file', { status: 500 });
  }
}