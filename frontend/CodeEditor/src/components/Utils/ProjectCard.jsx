import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setProject, setFiles } from "../../store/codeSlice";
import { clearAudioKey, addAudioTrack } from "../../store/audioSlice";
import { Trash2 } from "lucide-react";

const ProjectCard = ({ project, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/${project._id}`,
        { withCredentials: true }
      );

      const fullProject = res.data;

      dispatch(
        setProject({
          name: fullProject.name,
          projectId: fullProject._id,
          type: fullProject.type,
        })
      );

      dispatch(clearAudioKey());
      if (fullProject.media?.length > 0) {
        fullProject.media.forEach((track) => {
          dispatch(addAudioTrack(track));
        });
      }
      console.log(fullProject);
      
      if (Array.isArray(fullProject.files)) {
        dispatch(setFiles(fullProject.files));
      }

      if (fullProject.type === "dsa") navigate(`/dsa/${fullProject._id}`);
      if (fullProject.type === "dev") navigate(`/dev/${fullProject._id}`);
      if (fullProject.type === "assignment") navigate(`/assignment/${fullProject._id}`);
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/projects/${project._id}`,
        { withCredentials: true }
      );

      if (onDelete) onDelete(project._id);

      navigate(0)
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div
      className="project-card"
      onClick={handleClick}
      style={{
        border: "1px solid #666",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        aspectRatio: "20 / 9", // 🔥 ensures width:height = 20:9
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <Trash2 size={20} color="red" />
      </button>

      <h3 className="project-title" style={{ margin: "0 0 8px 0", textAlign: "center" }}>
        {project.name}
      </h3>
      <p className="project-type" style={{ margin: 0, textAlign: "center" }}>
        Type: <span>{project.type}</span>
      </p>
    </div>
  );
};

export default ProjectCard;
