import Project from "../Models/projectModel.js";
import storageService from "../appwriteClient.js";
import Media from "../Models/mediaModel.js"; // If needed for media deletion etc.
import File from "../Models/fileModel.js"

const normalizeProject = (project) => {
  return {
    name: project.name,
    projectId: project._id.toString(),
    user: project.user, // populated in getProjectById
    collaborators: project.collaborators || [],
    type: project.type || "",
    notes: project.notes || "",
    language: project.language || "",
    files: project.files || [],
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      user: req.user._id,
      collaborators: [],
      type: req.body.type,
      notes: req.body.notes || "",
      language: req.body.language || "javascript",
      files: req.body.files,
    });
    const saved = await project.save();

    const populatedProject = await Project.findById(saved._id).populate('files');

    // Normalize and send the project with populated files
    res.status(201).json(normalizeProject(populatedProject));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get a project by ID (with populated relations)
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        { collaborators: req.user._id },
      ],
    })
      .populate("user", "name email")
      .populate("collaborators", "name email")
      .populate({
        path: "files",
        populate: { path: "media" }
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found or access denied" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get projects summary for user
const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { user: userId },
        { collaborators: userId },
      ],
    }).select("name type notes createdAt updatedAt");

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Delete a project and associated media files
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const project = await Project.findById(id)
  .populate({
    path: "files",
    populate: { path: "media" }
  });


    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check ownership
    if (project.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all media files from Appwrite + DB
    // Iterate over all files and their media arrays
    for (const file of project.files) {
      for (const mediaDoc of file.media) {
        try {
          await storageService.deleteFile(mediaDoc); // replace bucketId as needed
          await Media.findByIdAndDelete(mediaDoc._id);
        } catch (err) {
          console.error("Error deleting media:", err);
        }
        
      }
      await File.findByIdAndDelete(file._id);
    }

    // Delete project
    await Project.findByIdAndDelete(id);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a collaborator to the project
const addMember = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id.toString();

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!Array.isArray(project.collaborators)) {
      project.collaborators = [];
    }

    if (project.user.toString() === userId) {
      return res.status(403).json({ message: "The user is already project Admin" });
    }

    if (project.collaborators.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.collaborators.push(userId);

    await project.save();

    return res.json({ message: "User added successfully", project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


const addFile = async (req, res) => {
  const projectId = req.params.projectId;

  try{
    const newFile = await File.create({
      filename: req.body.filename || 'untitled.js',
      language: req.body.language || 'javascript',
      code: '',
      output: '',
      testcase: [],
      media: [],
      project: projectId,
    })

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.files.push(newFile._id);
    await project.save();

    res.status(201).json(newFile);
  }
  catch(err){
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    console.log(projectId, fileId);
    
    const userId = req.user._id.toString();

    // Find the project to verify ownership
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete file' });
    }

    // Find the file with populated media and testcases
    const file = await File.findById(fileId).populate('media testcase');
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete all test cases associated with the file
    for (const testCaseDoc of file.testcase) {
      await TestCase.findByIdAndDelete(testCaseDoc._id);
    }

    // Delete media files from storage and media docs
    for (const mediaDoc of file.media) {
      try {
        if (mediaDoc.fileId) {
          await storageService.deleteFile(mediaDoc.fileId); // Adjust per your storage SDK
        }
        await Media.findByIdAndDelete(mediaDoc._id);
      } catch (err) {
        console.error('Error deleting media:', err);
      }
    }

    // Remove file ID from project.files array
    project.files.pull(fileId);
    await project.save();

    // Delete the file doc
    await File.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createProject,
  getProjectById,
  getProjects,
  deleteProject,
  addMember,
  addFile,
  deleteFile
};

