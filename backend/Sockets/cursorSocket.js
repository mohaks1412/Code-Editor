// cursorSocket.js
export default function cursorSocket(io, socket) {
  socket.on("cursorChange", ({ projectId, fileId, position, username }) => {
    socket.to(projectId).emit("cursorChange", { _fileId: fileId, _position:position, _username: username });
  });
}
