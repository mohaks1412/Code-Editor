// models/Project.js
import mongoose from "mongoose";
import TestCase from './testCaseModel.js'

const projectSchema = new mongoose.Schema({

  name : {type: String, required: true},

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  type: { type: String, required: true }, // DSA, DEV, Assignment, etc.

  files : [{type: mongoose.Schema.Types.ObjectId, ref : "File"}],

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
