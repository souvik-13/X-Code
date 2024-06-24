"use client";
import { NodeType } from "@/types";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  playgroundId: string;
  children: ReactNode;
}

interface ISocketContext {
  isConnected: boolean;
  workspaceLoaded: boolean;

  // workspace
  requestWorkspace: (
    projectName: string,
    callback: (data: {
      status: string;
      error?: string;
      fileTree?: NodeType;
    }) => void
  ) => void;
  // onWorkspaceCreated: (callback: (data: any) => void) => void;

  requestDirectory: (
    dirPath: string,
    callback: (data: {
      status: string;
      error: string | undefined;
      dirPath: string;
      content: NodeType | undefined;
    }) => void
  ) => void;

  requestFileContent: (
    filePath: string,
    callback: (data: {
      status: string;
      error: string | undefined;
      content: string | undefined;
    }) => void
  ) => void;

  // terminal
  requestTerminal: (terminalId: number, playgroundId: string) => void;
  killTerminalReq: (terminalId: number) => void;
  sendTerminalData: (terminalId: number, data: any) => void;
  sendTerminalDataBin: (terminalId: number, data: any) => void;
  recTerminalData: (
    callback: (data: {
      terminalId: number;
      terminalData: any;
      pid: number;
    }) => void
  ) => void;
}

export const SocketProvider = ({
  children,
  playgroundId,
}: SocketProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [workspaceLoaded, setWorkspaceLoaded] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!playgroundId) {
      throw "Playground Id not found";
    }
    console.log(playgroundId);
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log("connected to server", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket?.emit("close");
      newSocket.close();
      setIsConnected(false);
      setWorkspaceLoaded(false);
      newSocket.off()
      socket?.off()
      setSocket(undefined);
    };
  }, []);

  const requestWorkspace: ISocketContext["requestWorkspace"] = useCallback(
    async (projectName, callback) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }

      const response = await socket.emitWithAck("req-workspace", {
        projectName,
      });
      setWorkspaceLoaded(true);
      // console.trace(response);
      callback(response);
    },
    [socket, isConnected, workspaceLoaded]
  );

  const requestDirectory: ISocketContext["requestDirectory"] = useCallback(
    async (dirPath, callback) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }

      const response = await socket.emitWithAck("get-dir", { dirPath });
      callback(response);
    },
    [socket, isConnected]
  );

  const requestFileContent: ISocketContext["requestFileContent"] = useCallback(
    async (filePath, callback) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }

      const response = await socket.emitWithAck("get-file-content", {
        filePath,
      });
      callback(response);
    },
    [socket, isConnected]
  );

  // ******************** terminal ********************

  const requestTerminal: ISocketContext["requestTerminal"] = useCallback(
    (terminalId: number, playgroundId: string) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }
      socket.emit("request-terminal", {
        terminalId,
        playgroundId,
      });
    },
    [socket, isConnected]
  );

  const killTerminalReq: ISocketContext["killTerminalReq"] = useCallback(
    (terminalId: number) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }
      socket.emit("kill-terminal", { terminalId });
    },
    [socket, isConnected]
  );
  const sendTerminalData: ISocketContext["sendTerminalData"] = useCallback(
    (terminalId: number, data: any) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }
      socket.emit("terminal-data", {
        terminalId,
        data,
      });
    },
    [socket, isConnected]
  );

  const sendTerminalDataBin: ISocketContext["sendTerminalDataBin"] =
    useCallback(
      (terminalId: number, data: any) => {
        if (!socket || !isConnected) {
          console.log("Socket is not connected");
          return;
        }
        socket.emit("terminal-data-bin", {
          terminalId,
          data,
        });
      },
      [socket, isConnected]
    );

  const recTerminalData: ISocketContext["recTerminalData"] = useCallback(
    (callback) => {
      if (!socket || !isConnected) {
        console.log("Socket is not connected");
        return;
      }
      socket.on("terminal-data", (data) => {
        const { terminalId, terminalData, pid } = data;
        callback(data);
      });
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        // Genereal
        isConnected,
        workspaceLoaded,

        // workspace
        requestWorkspace,
        requestDirectory,
        requestFileContent,

        // Terminal
        requestTerminal,
        killTerminalReq,
        sendTerminalData,
        sendTerminalDataBin,
        recTerminalData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
