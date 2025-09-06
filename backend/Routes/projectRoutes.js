import express from "express";
import { 
  createProject,
  getProjectById, 
  getProjects, 
  deleteProject,
  addMember,
  addFile,
  deleteFile
} from '../Controllers/projectController.js'
import protect from "../Middlewares/protected.js";

const route = express.Router();

route.get("/", protect, getProjects);

route.post("/", protect, createProject);

route.get("/:id", protect, getProjectById);

route.delete("/:id", protect, deleteProject);

route.patch("/add-member/:id", protect, addMember);

route.post("/files/add/:projectId", protect, addFile)

route.delete("/files/delete/:projectId/:fileId", protect, deleteFile)

export default route;