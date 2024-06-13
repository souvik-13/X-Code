import { Server } from "socket.io"
import { Server as HTTPServer } from "node:http"
import fs from "node:fs"
import TerminalService from "./terminal";
import AwsService from "./aws";
import { fetchFileContent, filesTree, saveFile } from "./files";

export default class SocketService {
  private _io: Server;
  private terminalService: TerminalService;
  private awsService: AwsService;
  private playgroundId: string = "";

  constructor(httpServer: HTTPServer) {
    this._io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    this.awsService = new AwsService();
    this.terminalService = new TerminalService()
    this.initHandlers()
  }


  private initHandlers() {
    this.io.on("connection", (socket) => {
      console.log("Client connected", socket.id);

      // user credentials
      // console.log(socket.handshake)

      // this.userId = socket.id;

      socket.on("requestworkspace", async (data) => {
        const { projectName } = data;
        this.playgroundId = projectName;
        const key = `playgrounds/${projectName}`;
        fs.mkdirSync(`${process.env.HOME}/workspace`, { recursive: true });
        console.log("Requesting workspace", key)
        await this.awsService.downloadS3Folder(key, `${process.env.HOME}/workspace`);
        const fileTree = await filesTree(`${process.env.HOME}/workspace`);
        socket.emit("workspace-ready", {
          message: "Workspace ready",
          fileTree: fileTree,
        });
      });

      socket.on("get-file-content", async (data) => {
        const { filePath } = data;
        await fetchFileContent(filePath, `${process.env.HOME}/workspace`)
          .then((data) => {
            socket.emit("file-content", {
              message: "File content ready",
              content: data,
            });
          })
          .catch((err) => {
            console.log(err);
            socket.emit("file-content-error", {
              message: "Error fetching file content",
              error: err,
            });
          });
      });

      socket.on("update-file-content", async (data) => {
        const { filePath, content } = data;
        await saveFile(filePath, content, `${process.env.HOME}/workspace`)
          .then(async () => {
            await this.awsService.uploadFile(
              `playgrounds/${this.playgroundId}/${filePath}`,
              content,
            );
          })
          .catch((err) => {
            console.error(err);
          });
      });

      socket.on("request-terminal", () => {
        console.log("Request terminal");

      });

      socket.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }

  get io(): Server {
    return this._io;
  }
}