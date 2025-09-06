import { createContext, useEffect, useMemo } from "react";
import io from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  // ✅ useMemo so socket is created only once
  const socket = useMemo(() => io("http://localhost:5000"), []);

  useEffect(() => {
    console.log("🔌 Socket connected:", socket.id);

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children} {/* ❗ make sure children are rendered */}
    </SocketContext.Provider>
  );
};
