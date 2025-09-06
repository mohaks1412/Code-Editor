// ProjectLoader.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProject, updateFile } from "../store/codeSlice";
import { setTracks } from "../store/audioSlice";

  import socketService from "../socketService/socketService"
import { SocketContext } from "./contexts/SocketContext";

export default function ProjectLoader() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.code);
  const [loading, setLoading] = useState(true);
  const activeFileIndex = useSelector((state) => state.code.activeFileIndex);
  const file = project.files[activeFileIndex];
  const socket = useContext(SocketContext);

  // Initialize singleton SocketService
  useEffect(()=>{
    socketService.setSocket(socket);
    socketService.joinProject(projectId);

    return ()=>{
      socketService.leaveProject();
    }
  }, [projectId, socketService])

  // ---------------- Fetch Project ----------------
  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/projects/${projectId}`,
          { withCredentials: true }
        );
        const projectData = res.data;
        // Map audio tracks
        const activeFile = projectData.files?.[0];
        let tracks = [];
        if (activeFile?.media?.length > 0) {
          tracks = activeFile.media
            .filter((m) => m.type === "audio")
            .map((m) => ({
              id: m._id,
              fileId: m.fileId,
              url: `${import.meta.env.VITE_API_URL}/files/${m.fileId}`,
              x: m.coordinates?.x || 100,
              y: m.coordinates?.y || 100,
              name: m.metadata?.name || "untitled.mp3",
            }));
        }

        dispatch(setTracks(tracks));
        dispatch(setProject(projectData));
      } catch (err) {
        console.error(
          "❌ Failed to load project:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, dispatch]);

  // ---------------- AutoSave ----------------
  useEffect(() => {
    if (!file) return;

    const timeout = setTimeout(() => {
      axios
        .put(`${import.meta.env.VITE_API_URL}/files/${file._id}`, file, {
          withCredentials: true,
        })
        .then(() => console.log("✅ Auto-saved project"))
        .catch((err) => console.error("❌ Auto-save failed:", err));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [file, project.files, projectId]);


  if (loading) return <h2>Loading Project...</h2>;

  return (
      <Outlet context={{ projectId}} />
  );
}
