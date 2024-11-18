import {Schema, model, models} from "mongoose";

const projectSchema =new Schema({
    name: {
        type: String,
        required: true,
      },
      technologies: {
        type: [String],
        required: true,
      },
});

const Project = models.Project || model("Project",projectSchema);

export default Project;