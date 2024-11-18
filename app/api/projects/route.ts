import Project from '@/models/project'
import connectMangoDB from '@/utils/dbConfig'

export const GET = async() =>{
 await  connectMangoDB()
 const projects = await Project.find()
 return new Response(JSON.stringify(projects),{status:201,headers:{"Content-Type":"application/json"}});
}