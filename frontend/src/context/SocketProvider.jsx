/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

import socketio from "socket.io-client";
import Cookies from "js-cookie";
import { useAuth } from "./AuthProvider";

const getSocket = () => {
  const token = Cookies.get("chat_token");
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URI;
  // const SOCKET_URL = "http://localhost:5000";

  const socketInstance = socketio(SOCKET_URL, {
    withCredentials: true,
    auth: { token },
  });

  return socketInstance;
};

//
const SocketContext = createContext({
  socket: null,
});

// Custom hook to access the socket instance from the context
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  // State to store the socket instance
  const [socket, setSocket] = useState(null);

  // Set up the socket connection when the component mounts
  useEffect(() => {
    if (user) {
      setSocket(getSocket());
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
