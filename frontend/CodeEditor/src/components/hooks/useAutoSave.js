// src/hooks/useAutoSave.js
import { useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useAutoSave(projectId) {
  const project = useSelector(state => state.code);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;
    console.log(timeoutRef.current);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      console.log("Updating...");
      
      const token = localStorage.getItem("token");
      axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}`,
        project,
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => console.error("Auto-save failed:", err));
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [project, projectId]);
}
