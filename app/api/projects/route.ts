import Project from '@/models/project'
<<<<<<< HEAD
import connectMongoDB from '@/lib/mongodb'
=======
import connectMangoDB from '@/lib/mongodb'
>>>>>>> origin/M-userauth-functionalities

export const GET = async(request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

<<<<<<< HEAD
    await connectMongoDB();
=======
    await connectMangoDB();
>>>>>>> origin/M-userauth-functionalities
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
<<<<<<< HEAD
    await connectMongoDB();
    const { name, technologies, userId, finalPrompt, referenceFile } = await request.json();
=======
    await connectMangoDB();
    const { name, technologies, userId } = await request.json();
>>>>>>> origin/M-userauth-functionalities
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const project = await Project.create({
      name,
      technologies,
      userId,
      finalPrompt,
      referenceFile
    });
    
    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response('Error creating project', { status: 500 });
  }
}