import mongoose from "mongoose";
const testcaseSchema = new mongoose.Schema({
  input: { type: String },
  expected: { type: String },
  received: { type: String },
  status: {type: Boolean, default:null}
}, { _id: true });

export default mongoose.model("TestCase", testcaseSchema);