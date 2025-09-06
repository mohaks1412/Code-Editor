export default function codeSocket(io, socket) {
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`👥 User ${socket.id} joined project: ${projectId}`);
  });

  socket.on("codeChange", ({ projectId, fileId, code }) => {

    console.log("📤 Broadcasting codeChange to project:",projectId, fileId);
    
    
    // Send to *everyone* in the room (including sender)
    socket.to(projectId).emit("codeChange", { _projectId: projectId, _fileId: fileId, newCode : code });
  });
}
