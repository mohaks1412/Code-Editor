import mongoose, { Mongoose } from "mongoose";
import Project from './projectModel.js'
import User from './userModel.js'

const mediaSchema = new mongoose.Schema({
    fileId:{
        type: String,
        required: true
    },

    type:{
        type : String,
        enum: ["profilePic", "audio"],
        required: true
    },

    owner :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },

    coordinates: {
        x : {
            type: Number,
            default: 0,
        },

        y : {
            type: Number,
            default: 0,
        }
    },

    metadata: {
        name: String,
        size: Number,
        contentType: String
    },

    
},

{timestamps : true})

export default mongoose.model("Media", mediaSchema);
