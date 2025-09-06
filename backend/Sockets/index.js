import audioSocket from "./audioSocket.js";
import codeSocket from "./codeSocket.js";
import cursorSocket from "./cursorSocket.js";
import notepadSocket from "./notepadSocket.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Load all socket modules
    codeSocket(io, socket);
    notepadSocket(io, socket); 
    cursorSocket(io, socket);
    audioSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
