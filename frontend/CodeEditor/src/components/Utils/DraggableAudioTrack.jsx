import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { setCoordinates } from "../../store/audioSlice";
import axios from "axios";
import { viewFile } from "../appwrite/appwriteService";
import socketService from "../../socketService/socketService";

export default function DraggableAudioTrack({ id, x = 100, y = 100 }) {
  const [ownerId, setOwnerId] = useState(null);
  const userId = useSelector((state) => state.user.id);
  
  const tracks = useSelector(state => state.audio.tracks);
  const [localPos, setLocalPos] = useState({ x, y });
  const tab = useSelector((state) => state.tabs.rightActiveTab);
  const dispatch = useDispatch();
  const nodeRef = useRef(null);
  const fileId = useSelector(
    (state) => state.code.files[state.code.activeFileIndex]._id
  );

  // Pull this track’s data from Redux
  const track = useSelector((state) =>
    state.audio.tracks.find((t) => t.id === id)
  );

  // Generate URL from fileId
  const audioUrl = track?.fileId ? viewFile(track.fileId) : null;

  

  // ✅ Fetch ownerId once when component mounts
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/media/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setOwnerId(res.data); // make sure backend sends just a string
      })
      .catch((err) => console.error("Failed to fetch ownerId:", err));
  }, [id]);

  const handleStop = (e, data) => {
    if (userId !== ownerId) {
      console.log("Access Denied! Not the owner.");
      return;
    }

    setLocalPos({ x: data.x, y: data.y });
    dispatch(setCoordinates({ id, x: data.x, y: data.y }));

    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/media/${id}/coordinates`,
        { x: data.x, y: data.y },
        { withCredentials: true }
      )
      .catch((err) => console.error("Failed to update coordinates:", err));
  };

  // -------------------------------------------------- Socket Integration -----------------------------------------------------
  const handleRemoteAudioMove = ({_id, _x, _y }) => {
    if (!_x || !_y) return;

    

    dispatch(setCoordinates({ id:_id, x: _x, y: _y }));
  };

  // ✅ Only emit if this user is the owner
  useEffect(() => {
    if (!ownerId) return; // wait until loaded
    if (userId !== ownerId) return; // block non-owners

    socketService.emitAudioMove(id, localPos);
  }, [localPos, userId, ownerId]);

  useEffect(() => {
    socketService.setFileId(fileId);
    socketService.addAudioMoveListener(handleRemoteAudioMove);

    return () => {

      if(tracks.length > 0){
        return;
      }
      
      socketService.removeAudioMoveListener();
    };
  }, []);

  // ----------------------------------------------------- structure -------------------------------------------------------------
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: track?.x ?? 0, y: track?.y ?? 0 }}
      onStop={handleStop}
      disabled={userId !== ownerId} // ✅ disable dragging for non-owners
    >
      <div
        ref={nodeRef}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("trackId", id); // pass id for delete
        }}
        style={{
          display: "inline-block",
          zIndex: 2,
          pointerEvents: "auto",
          cursor: userId === ownerId ? "move" : "not-allowed",
          position: "relative",
          opacity: tab === "Test Cases" ? 0 : 1,
        }}
      >
        <div style={{ background: "#eee", borderRadius: "6px" }}>
          {audioUrl ? (
            <audio src={audioUrl} controls style={{ width: "150px" }} />
          ) : (
            <div style={{ minHeight: 24 }}>Loading…</div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
