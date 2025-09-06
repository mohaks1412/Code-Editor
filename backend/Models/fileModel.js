import mongoose from "mongoose";
import Media from './mediaModel.js'
import TestCase from './testCaseModel.js'

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  language: { type: String, required: true, default: "javascript" },
  code: { type: String, default: "" },
  question: {type:String, default: ""},   // only for DSA
  notes: {type:String, default: ""},      // only nor DSA
  output: {type:String, default: ""}, // n/a for just DSA
  input: {type:String, default: ""}, // n/a for just DSA
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    testcase: [{type: mongoose.Schema.Types.ObjectId, ref : "TestCase", default: []}],
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
