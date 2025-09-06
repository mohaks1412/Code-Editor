export default function notepadSocket(io, socket) {

  socket.on("notepadChange", ({ projectId, fileId, text, tab }) => {
    console.log("📤 Broadcasting textChange to project:",projectId, fileId);
    console.log("test : ", text);
    
    
    // Send to *everyone* in the room (excluding sender)
    io.to(projectId).emit("notepadChange", { _projectId: projectId, _fileId: fileId, newText : text, _tab : tab });
  });
}
