import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    // Each track = { id, fileId, x, y, name, size, contentType }
    tracks: [],
  },
  reducers: {
    // Add a new track (store fileId instead of url)
    addAudioTrack: (state, action) => {
      state.tracks.push(action.payload);
      // payload should be { id, fileId, x, y, name?, size?, contentType? }
    },

    // Update a track’s coordinates
    setCoordinates: (state, action) => {
      const { id, x, y } = action.payload;

      console.log( { id, x, y });
      
      const trackToUpdate = state.tracks.find(track => track.id === id);
      if (trackToUpdate) {
        trackToUpdate.x = x;
        trackToUpdate.y = y;
      }
    },

    // If you later need to temporarily cache a resolved URL (via getFileView)
    setTrackUrl: (state, action) => {
      const { id, url } = action.payload;
      const trackToUpdate = state.tracks.find(track => track.id === id);
      if (trackToUpdate) {
        trackToUpdate.url = url; // 👈 optional, not persisted in DB
      }
    },

    // Delete a track
    removeAudioTrack: (state, action) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
    },

    // Replace all tracks at once (after fetching from backend)
    setTracks: (state, action) => {
      state.tracks = action.payload;
      // payload = [{ id, fileId, x, y, name?, size?, contentType? }, ...]
    },


    // Reset everything
    clearAudioKey: (state) => {
      state.tracks = [];
    },
  },
});

export const {
  addAudioTrack,
  setCoordinates,
  setTrackUrl,
  removeAudioTrack,
  setTracks,
  clearAudioKey,
} = audioSlice.actions;

export default audioSlice.reducer;
