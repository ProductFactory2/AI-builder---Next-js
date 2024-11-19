import Project from '@/models/project'
import connectMangoDB from '@/lib/mongodb'

export const GET = async() =>{
 await  connectMangoDB()
 const projects = await Project.find()
 return new Response(JSON.stringify(projects),{status:201,headers:{"Content-Type":"application/json"}});
}