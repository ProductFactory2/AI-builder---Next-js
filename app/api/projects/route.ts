import Project from '@/models/project'
import connectMangoDB from '@/lib/mongodb'

export const GET = async(request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectMangoDB();
    const projects = await Project.find({ userId: userId });
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response('Error fetching projects', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectMangoDB();
    const { name, technologies, userId } = await request.json();
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const project = await Project.create({
      name,
      technologies,
      userId
    });
    
    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response('Error creating project', { status: 500 });
  }
}