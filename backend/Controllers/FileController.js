import File from "../Models/fileModel.js";

const createFile = async (req, res) => {  
  try {
    const { filename, language, code, output, testcase, media } = req.body;

    // Basic validation
    if (!filename || !language) {
      return res.status(400).json({ message: "Filename and language are required" });
    }

    const file = new File({
      filename,
      language,
      code: code || "",
      output: output || "",
      testcase: testcase || [],
      media: media || [],
    });

    const savedFile = await file.save();

    res.status(201).json(savedFile);
  } catch (err) {
    console.error("Create file error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /files/:fileId
const updateFile = async (req, res) => {
  
  try {
    const updateData = { ...req.body };
    const fileId = req.params.fileId;
    
    // Optional validation on updateData

    const file = await File.findOneAndUpdate(
      { _id: fileId },
      { $set: updateData },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export {createFile, updateFile};