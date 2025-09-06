import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./Utils/ProjectCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Button from "./Button"
import './MyProjects.css'; // New CSS file for styling

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // Conditional rendering based on the projects array length
  if (projects.length === 0) {
    return (
      <div className="my-projects-container">
        <div className="empty-state">
          <h2>Nothing to see here!</h2>
          <p>It looks like you haven't created or joined any projects yet.</p>
          <div className="button-group">
            <Button onClick={() => navigate('/new-project')}>New Project</Button>
            <Button onClick={() => navigate('/join-project')}>Join Project</Button>
          </div>
        </div>
      </div>
    );
  }

  // Render the project grid if there are projects
  return (
    <div className="my-projects-container">
      <h2>My Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default MyProjects;