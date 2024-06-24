import { IPty, spawn } from "node-pty";
import * as os from "node:os";
const SHELL = os.platform() === "win32" ? "powershell.exe" : "bash";
export default class TerminalService {
  private sessions: {
    [id: string]: { terminal: IPty; playgroundId: string }[];
  } = {};

  constructor() {
    this.sessions = {};
  }

  createTerminal({
    sessionId,
    playgroundId,
    onData,
  }: {
    sessionId: string;
    playgroundId: string;
    onData: (data: any, pid: string) => void;
  }) {
    const terminal = spawn(SHELL, [], {
      name: "xterm-color",
      cwd: `${process.env.HOME}/${playgroundId}`,
      env: process.env as { [key: string]: string },
    });

    terminal.onData((data) => onData(data, terminal.pid.toString()));

    if (!this.sessions[sessionId]) this.sessions[sessionId] = [];

    this.sessions[sessionId].push({
      terminal: terminal,
      playgroundId: playgroundId,
    });

    console.log(
      "Created terminal",
      sessionId,
      playgroundId,
      terminal.pid.toString()
    );
    console.table(this.sessions[sessionId]);

    terminal.onExit(() => {
      delete this.sessions[sessionId];
    });
    return terminal;
  }

  write(sessionId: string, terminalId: number, data: string) {
    // console.log("Writing to terminal", sessionId, terminalId, data)
    // console.log(this.sessions[sessionId])
    let term = this.sessions[sessionId]?.[terminalId];
    if (term) {
      term.terminal.write(data);
    } else {
      console.log("Terminal not found");
    }
  }

  writeBin(sessionId: string, terminalId: number, data: any) {
    console.log("bin data", data);
    // console.log("Writing to terminal", sessionId, terminalId, data)
    // console.log(this.sessions[sessionId])
    let term = this.sessions[sessionId]?.[terminalId];
    if (term) {
      term.terminal.write(data);
    } else {
      console.log("Terminal not found");
    }
  }

  kill(sessionId: string, terminalId: number = -1) {
    if (terminalId === -1) {
      // kill all terminals
      this.sessions[sessionId]?.forEach(({ terminal }) => {
        terminal.kill();
      });
      delete this.sessions[sessionId];
    } else {
      this.sessions[sessionId]?.[terminalId].terminal.kill();
    }
  }
}
