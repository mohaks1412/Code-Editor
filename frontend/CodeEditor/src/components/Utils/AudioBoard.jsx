import React from 'react';
import { useSelector } from 'react-redux';
import DraggableAudioTrack from './DraggableAudioTrack';

const AudioBoard = () => {
  const tracks = useSelector((state) => state.audio.tracks);
  console.log(tracks);
  
  return (
    <div
      style={{
        position: "absolute", // take it out of layout
        top: 0,
        left: 0,
        width: "0px",
        height: "0px",
        overflow: "visible", // allow tracks to be seen outside
      }}
    >
      
      {tracks.map((track, index) => (
        
        
        <DraggableAudioTrack
          key={track.id ?? index}
          id={track.id}
          x={track.x}
          y={track.y}
        />
      ))}
    </div>
  );
};

export default AudioBoard;
