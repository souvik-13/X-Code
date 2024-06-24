import { Server } from "socket.io";
import { Server as HTTPServer } from "node:http";
import fs from "node:fs";
import TerminalService from "./terminal";
import AwsService from "./aws";
import { fetchDir, fetchFileContent, filesTree, saveFile } from "./files";
import chokidar from "chokidar";
import { dir } from "node:console";
import e from "express";
import { NodeType } from "../types";

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

      socket.on("req-workspace", async (data, callback) => {
        const { projectName } = data;
        this.playgroundId = projectName;

        const key = `playgrounds/${projectName}`;

        let responseData: {
          status: string;
          error: string | undefined;
          fileTree: NodeType | undefined;
        } = {
          status: "success" || "error",
          error: undefined,
          fileTree: undefined,
        };

        try {
          // delete the current /workspace folder
          // fs.rmdirSync(`${process.env.HOME}/workspace`, { recursive: true });
          fs.mkdirSync(`${process.env.HOME}/${this.playgroundId}`, {
            recursive: true,
          });
          console.log("Requesting workspace", key);
          await this.awsService.downloadS3Folder(
            key,
            `${process.env.HOME}/${this.playgroundId}`
          );
          // const fileTree = await filesTree(`${process.env.HOME}/${this.playgroundId}`);
          // const fileTree = await fetchDir({
          //   dir: ".",
          //   baseDir: `${process.env.HOME}/${this.playgroundId}`,
          //   exclude: [".git"],
          // });
          responseData.status = "success";
          // responseData.fileTree = fileTree;
          callback(responseData);
          // socket.emit("workspace-ready", { fileTree: fileTree });
        } catch (error) {
          console.error(error);
          responseData.status = "error";
          responseData.error = "Error fetching workspace";
          callback(responseData);
          // socket.emit("workspace-error", { error: error });
        }
      });

      socket.on("get-dir", async (data, callback) => {
        const { dirPath } = data;
        let responseData: {
          status: string;
          error: string | undefined;
          dirPath: string;
          content: NodeType | undefined;
        };
        await fetchDir({
          dir: dirPath,
          baseDir: `${process.env.HOME}/${this.playgroundId}`,
          exclude: [".git", "node_modules"],
        })
          .then((data) => {
            responseData = {
              status: "success",
              error: undefined,
              dirPath: dirPath,
              content: data,
            };
          })
          .catch((err) => {
            console.log(err);
            responseData = {
              status: "error",
              error: "Error fetching directory",
              dirPath: dirPath,
              content: undefined,
            };
          })
          .finally(() => {
            callback(responseData);
          });
      });

      socket.on("get-file-content", async (data, callback) => {
        const { filePath } = data;
        let responseData: {
          status: string;
          error: string | undefined;
          content: string | undefined;
        };
        await fetchFileContent(
          filePath,
          `${process.env.HOME}/${this.playgroundId}`
        )
          .then((data) => {
            responseData = {
              status: "success",
              error: undefined,
              content: data,
            };
          })
          .catch((err) => {
            console.log(err);
            responseData = {
              status: "error",
              error: "Error fetching file content",
              content: undefined,
            };
          })
          .finally(() => {
            callback(responseData);
          });
      });

      socket.on("update-file-content", async (data) => {
        const { filePath, content } = data;
        await saveFile(
          filePath,
          content,
          `${process.env.HOME}/${this.playgroundId}`
        )
          .then(async () => {
            await this.awsService.uploadFile(
              `playgrounds/${this.playgroundId}/${filePath}`,
              content
            );
          })
          .catch((err) => {
            console.error(err);
          });
      });

      socket.on(
        "request-terminal",
        (data: { terminalId: number; playgroundId: string }) => {
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
            },
          });
          // console.log(this.terminalService.terminals)
        }
      );

      socket.on(
        "terminal-data",
        (data: { terminalId: number; data: string }) => {
          const { terminalId, data: terminalData } = data;
          // console.log("Received terminal data", terminalData, "from terminal", terminalId)
          this.terminalService.write(socket.id, terminalId, terminalData);
        }
      );

      socket.on(
        "terminal-data-bin",
        (data: { terminalId: number; terminalData: string }) => {
          const { terminalId, terminalData } = data;
          // console.log("Received terminal data", terminalData, "from terminal", terminalId)
          this.terminalService.writeBin(
            socket.id,
            terminalId,
            Buffer.from(terminalData, "binary")
          );
        }
      );

      socket.on("close", () => {
        console.log("Closing terminal session", socket.id);
        this.terminalService.kill(socket.id);
        fs.rmdirSync(`${process.env.HOME}/${this.playgroundId}`, {
          recursive: true,
        });
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
