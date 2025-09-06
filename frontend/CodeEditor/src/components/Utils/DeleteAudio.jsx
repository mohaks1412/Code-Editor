// DeleteAudio.jsx
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAudioTrack, addAudioTrack } from "../../store/audioSlice";
import localforage from "localforage";
import axios from "axios";
import { useParams } from "react-router-dom";
import store from "../../store/store";
import socketService from "../../socketService/socketService";

export default function DeleteAudio({ onDropAudio }) {
  const dispatch = useDispatch();
  
  const [trackId, setTrackId] = useState(null);
    console.log("Current slice state:", store.getState().code);
      const activeFileIndex = useSelector(state => state.code.activeFileIndex);
    const files = useSelector(state => state.code.files);
    const currentFileId = files.length > 0 ? files[activeFileIndex]?._id : null;

      const tracks = useSelector((state) =>
      state.audio.tracks
    );
    const handleDrop = async (e) => {
      e.preventDefault();
      const droppedId = e.dataTransfer.getData("trackId");
      if (!droppedId) return;

      setTrackId(droppedId); // optional, for socket useEffect

      const track = tracks.find((t) => t.id === droppedId);
      if (!track) return;

      try {
        // 1. Update Redux (instant UI feedback)
        dispatch(removeAudioTrack(droppedId));

        // 2. Call backend API
        try {
          const res = await axios.delete(
            `${import.meta.env.VITE_API_URL}/media/${droppedId}/${currentFileId}`,
            { withCredentials: true }
          );
          console.log("✅ Deleted:", res.data);
        } catch (err) {
          console.error("❌ Error deleting:", err.response?.data || err.message);
          if (err.response?.status === 403) {
            alert("You are not allowed to delete this audio");
          }
          dispatch(addAudioTrack({ ...track })); // rollback if fail
        }
      } catch (err) {
        console.error("Error deleting audio:", err);
      }
    };


  //--------------------------------------------------Socket integration------------------------------------------------------
  

    const handleRemoveAudioDelete = ({_projectId, _trackId}) => {
      if(!_trackId){
        return;
      }

      dispatch(removeAudioTrack(_trackId))
    }

    useEffect(()=>{
      socketService.emitAudioDelete(trackId);
    }, [trackId]);

    useEffect(()=>{

      socketService.addDeleteAudioListener(handleRemoveAudioDelete)
      return ()=>{
        socketService.removeDeleteAudioListener();
      }
    }, [])
  

  //-------------------------------------------------------Structure----------------------------------------------------------

  return (
    <div
      onDragOver={(e) => e.preventDefault()} // allow drop
      onDrop={handleDrop}
      style={{
        height: '20px',
        width: '20px',
        background: "#ff4d4d",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        cursor: "pointer",
        zIndex: 999,
        textAlign:"center",
      }}
    >🗑</div>
  );
}
