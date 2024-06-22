"use client";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
    socket?: Socket;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected to server", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    return () => {
      newSocket.close();
      newSocket.off("connect");
      newSocket.off("disconnect");
      setSocket(undefined);
    };
  }, []);

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>;
};
