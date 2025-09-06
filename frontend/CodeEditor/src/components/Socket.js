import { io } from "socket.io-client";

// Create a single global socket instance
export const socket = io("/", {
  withCredentials: true, // send cookies if needed
  transports: ["websocket"], 
});
