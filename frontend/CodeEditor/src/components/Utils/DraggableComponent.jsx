import { useState, useEffect } from "react";
import axios from "axios";


function DraggableAudioTrack({ projectId }) {
  const [tracks, setTracks] = useState([]);

  const fetchTracks = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/media/${projectId}`,
      { withCredentials: true }
    );
    setTracks(res.data);
  };

  useEffect(() => {
    fetchTracks();
  }, [projectId]);

  return (
    <div>
      {tracks.map((track) => (
        <div key={track._id} style={{ position: "absolute", left: track.coordinates.x, top: track.coordinates.y }}>
          <audio controls src={track.url}></audio>
        </div>
      ))}
    </div>
  );
}

export default DraggableAudioTrack;
