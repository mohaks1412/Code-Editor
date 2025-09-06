import Media from "../Models/mediaModel.js";
import StorageService from "../appwriteClient.js";
import Project from "../Models/projectModel.js";
import File from "../Models/fileModel.js"

const upload = async (req, res) => {
  try {
    const { type, project: projectId, fileId, coordinates } = req.body;

    const file = req.file;    // audio file

    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Appwrite
    const uploaded = await StorageService.createFile(file);

    // Save media doc with just fileId
    const media = await Media.create({
      fileId: uploaded.$id,
      type,
      owner: req.user._id,
      project: projectId,
      coordinates: coordinates || { x: 0, y: 0 },
      metadata: {
        name: file.originalname,
        size: file.size,
        contentType: file.mimetype,
      },
    });

    // Add media._id into the specified file's media array in project
    const project = await Project.findById(projectId).populate('files');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Find file in project's files array by fileId (sent from client)
    const targetFile = project.files.find(f => f._id.toString() === fileId);
    
    
    if (!targetFile) {
      return res.status(404).json({ message: "File not found in project" });
    }



    targetFile.media.push(media._id);
    
    await targetFile.save();

    await project.save();


    // Return media doc to frontend
    res.status(200).json(media);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateCoordinates = async (req, res) => {
  try {
    const { x, y } = req.body;

    if (typeof x !== "number" || typeof y !== "number") {
      return res.status(400).json({ message: "Coordinates must be numbers" });
    }

    const updatedMedia = await Media.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { coordinates: { x, y } },
      { new: true }
    );
    
    if (!updatedMedia) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json(updatedMedia);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:projectId/media/:mediaId
const deleteMedia = async (req, res) => {
  try {
    const { fileId, mediaId } = req.params;

    // Find the media doc
    const media = await Media.findById(mediaId);
    
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Ownership check
    if (media.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this media" });
    }

    // Find project and remove media from the correct file's media array
    const currfile = await File.findById(fileId);
    if (!currfile) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove media ID from file.media array
    currfile.media.pull(mediaId);
    await currfile.save();

    // Delete media document
    await Media.findByIdAndDelete(mediaId);

    // Delete the file from Appwrite storage, if exists
    if (media.fileId) {
      await StorageService.deleteFile(media.fileId);
    }

    res.status(200).json({
      message: "Media removed successfully",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserId = async (req, res) =>{
  try{
  const mediaId = req.params.mediaId;

  const media = await Media.findById(mediaId);

  

  if(!media){
    return res.status(404).json({message : "Media not found"});
  }

  const ownerId = media.owner.toString();
  
  res.json(ownerId);
  }
  catch(err){
    console.log(err.message);
    
  }
}

export { upload, updateCoordinates, deleteMedia, getUserId };
