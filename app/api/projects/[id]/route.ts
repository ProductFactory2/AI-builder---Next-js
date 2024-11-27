import Project from '@/models/project'
import connectMongoDB from '@/lib/mongodb'

export const DELETE = async (req: Request, context: any) => {
  try {
    await connectMongoDB();
    const { params } = context;
    const { id } = params;
    
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return new Response('Project not found', { status: 404 });
    }

    return new Response(JSON.stringify(deletedProject), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response('Error deleting project', { status: 500 });
  }
}


export const GET = async (req: Request, context: any) => {
  const { params } = context;
  const { id } = params;

  await connectMongoDB();
  const projects = await Project.find({ userId: id });
  return new Response(JSON.stringify(projects), { status: 200 });
}

