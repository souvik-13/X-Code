import { Server } from "socket.io"
import { Server as HTTPServer } from "node:http"
import fs from "node:fs"
import TerminalService from "./terminal";
import AwsService from "./aws";
import { fetchFileContent, filesTree, saveFile } from "./files";
import chokidar from "chokidar"

export default class SocketService {
  private _io: Server;
  private terminalService: TerminalService;
  private awsService: AwsService;
  private playgroundId: string = "";
  // private _watcher: chokidar.FSWatcher;

  constructor(httpServer: HTTPServer) {
    this._io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    this.awsService = new AwsService();
    this.terminalService = new TerminalService();
    this.initHandlers();
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
        // delete the current /workspace folder
        // fs.rmdirSync(`${process.env.HOME}/workspace`, { recursive: true });
        fs.mkdirSync(`${process.env.HOME}/${this.playgroundId}`, { recursive: true });
        console.log("Requesting workspace", key)
        await this.awsService.downloadS3Folder(key, `${process.env.HOME}/${this.playgroundId}`);
        const fileTree = await filesTree(`${process.env.HOME}/${this.playgroundId}`);
        socket.emit("workspace-ready", {
          message: "Workspace ready",
          fileTree: fileTree,
        });
      });

      socket.on("get-file-content", async (data) => {
        const { filePath } = data;
        await fetchFileContent(filePath, `${process.env.HOME}/${this.playgroundId}`)
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
        await saveFile(filePath, content, `${process.env.HOME}/${this.playgroundId}`)
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

      socket.on("request-terminal", (data: { terminalId: number, playgroundId: string }) => {
        const { terminalId, playgroundId } = data;
        this.terminalService.createTerminal({
          sessionId: socket.id,
          playgroundId,
          onData: (data, pid) => {
            // console.log(Buffer.from(data, "utf-8").toString())
            socket.emit("terminal-data", {
              terminalId: terminalId,
              terminalData: Buffer.from(data, "utf-8"),
              pid: pid,
            });
          }
        })
      });

      socket.on("terminal-data", (data: { terminalId: number, data: string }) => {
        const { terminalId, data: terminalData } = data;
        // console.log("Received terminal data", terminalData, "from terminal", terminalId)
        this.terminalService.write(socket.id, terminalId, terminalData);
      });

      socket.on("close", () => {
        console.log("Closing terminal session", socket.id);
        this.terminalService.kill(socket.id);
        fs.rmdirSync(`${process.env.HOME}/${this.playgroundId}`, { recursive: true });

      });
    });
  }

  private onPlaygroundIdSet(playgroundId: string) {
    this.playgroundId = playgroundId;
    // this.initializeWatcher(); // Initialize the watcher after setting the playground ID
  }
  private initializeWatcher() {
    if (!this.playgroundId) {
      console.error("Playground ID is not set.");
      return;
    }

    // const watchPath = `/path/to/directory/${this.playgroundId}`; // Adjust the path as needed
    // this._watcher = new chokidar.FSWatcher({
    //   cwd: `${process.env.HOME}/${this.playgroundId}`
    // });
    // this._watcher.on('all', (event, path) => {
    //   console.log(event, path);
    //   // Handle file changes here
    // });

    // // Start watching
    // this._watcher.watch();
  }

  get io(): Server {
    return this._io;
  }
}

// const cleanup = (callbacks: Array<() => Promise<any>>, timeout: number) => {
//   setTimeout( ()=>{
//     Promise.all(callbacks.map(cb => cb().then(()=>{}).catch(()=>{}) ))
//     .then(()=>{})
//     .catch(()=>{})
//   }, timeout)
// }