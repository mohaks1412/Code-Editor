import React, { useEffect, useRef, useState } from 'react';
import { addAudioTrack } from "../../store/audioSlice";
import localforage from "localforage";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from 'react-redux';
import './RecordBtn.css'; 
import axios from 'axios';
import socketService from '../../socketService/socketService';

const RecordBtn = () => {

  const [lastAudio, setLastAudio] = useState(null);
  const dispatch = useDispatch();
  const currentProjectId = useSelector(state => state.code.projectId);
  const activeFileIndex = useSelector(state => state.code.activeFileIndex);
  const currentFile = useSelector(state=>state.code.files[activeFileIndex]);

  let currentFileId;

  if(currentFile){
    currentFileId = currentFile._id
  }

  const [isRecording, setIsRecording] = useState(false);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' });

        const formData = new FormData();
        formData.append("file", recordedBlob, `audio-${Date.now()}.mp3`);
        formData.append("project", currentProjectId); 
        formData.append("type", "audio");
        formData.append("fileId", currentFileId);

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/media/upload`,
            formData,
            { withCredentials: true }
          );

          const media = res.data;

          // Dispatch track with fileId (not url)
          dispatch(addAudioTrack({
            id: media._id,                     // Mongo _id
            fileId: media.fileId,              // Appwrite fileId
            x: media.coordinates?.x || 100,
            y: media.coordinates?.y || 100,
            name: media.metadata?.name,
            size: media.metadata?.size,
            contentType: media.metadata?.contentType
          }));

          setLastAudio({
            id: media._id,                     // Mongo _id
            fileId: media.fileId,              // Appwrite fileId
            x: media.coordinates?.x || 100,
            y: media.coordinates?.y || 100,
            name: media.metadata?.name,
            size: media.metadata?.size,
            contentType: media.metadata?.contentType
          });

        } catch (err) {
          console.error("Upload failed:", err);
        }

        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error(error);
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
  };


  //-----------------------------------------------------SocketIntegration----------------------------------------------------


  const handleRemoteAudioAdd = ({_projectId, _fileId, _audio})=>{

    if(!_projectId || !_fileId || !_audio){
      return;
    }

    _audio.fileId = _fileId;

    dispatch(addAudioTrack(_audio))
  }
    useEffect(() => {

      if(!lastAudio){
        return;
      }

    socketService.emitAudioAdd(lastAudio);

  }, [lastAudio]); 

  useEffect(()=>{
    socketService.setFileId(currentFileId);
    socketService.addAudioAddListener(handleRemoteAudioAdd);
    return()=>{
      socketService.removeAudioAddListener();
    }
  }, [currentFileId])


  //----------------------------------------------------------Structure------------------------------------------------------

  return (
    <div className="recordbtn-container">
      <button
        className="recordbtn"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop" : "Record Notes"}
      </button>
    </div>
  );
};

export default RecordBtn;
