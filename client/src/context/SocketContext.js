// client/src/context/SocketContext.js

import { createContext, useContext, useEffect } from "react";
import socket from "@/lib/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Connect the socket only when the user is logged in
      socket.connect();
      console.log("🔌 Connecting to socket server...");
    }

    return () => {
      // Disconnect when the component unmounts or user logs out
      socket.disconnect();
      console.log("🔌 Disconnecting from socket server...");
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
