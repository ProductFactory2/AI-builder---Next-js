import {Schema, model, models, Types} from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
<<<<<<< HEAD
    },
    finalPrompt: {
        type: String,
        required: true
    },
    referenceFile: {
        fileName: String,
        fileData: String,
        fileType: String
    }
}, {
    timestamps: true
    }
);
=======
    }
}, {
    timestamps: true  // Optional: adds createdAt and updatedAt fields
});
>>>>>>> origin/M-userauth-functionalities

const Project = models.Project || model("Project", projectSchema);

export default Project;