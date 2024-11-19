import Project from '@/models/project'
import connectMongoDB from '@/lib/mongodb'

export const DELETE = async (req: Request, context : any) => {
  await connectMongoDB();
  const {params} = context;
  let {id} =await params;
  const projects = await Project.findByIdAndDelete(id);
  return new Response(JSON.stringify(projects), { status: 200, headers: { "Content-Type": "application/json" } });
}