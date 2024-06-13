import { IPty, spawn } from "node-pty";
export default class TerminalService {
  private sessions: { [id: string]: { terminal: IPty; playgroundId: string }[] } = {};

  constructor() {
    this.sessions = {};
  }

  createTerminal({
    id,
    playgroundId,
    onData,
  }: {
    id: string;
    playgroundId: string;
    onData: (data: any, pid: string) => void;
  }) {
    const terminal = spawn("bash", [], {
      name: "xterm-color",
      cols: 100,
      rows: 30,
      cwd: `${process.env.HOME}/workspace`,
      env: process.env as { [key: string]: string },
    });

    terminal.onData((data) => onData(data, terminal.pid.toString()));

    this.sessions[id].push({
      terminal: terminal,
      playgroundId: playgroundId,
    })

    terminal.onExit(() => {
      delete this.sessions[id];
    });
    return terminal;
  }

  write(sessionId: string, terminalId: number, data: string) {
    this.sessions[sessionId]?.[terminalId]?.terminal.write(data);
  }

  kill(sessionId: string, terminalId: number = -1) {
    if (terminalId === -1) {  // kill all terminals
      this.sessions[sessionId]?.forEach(({ terminal }) => {
        terminal.kill()
      })
      delete this.sessions[sessionId];
    }
    else {
      this.sessions[sessionId]?.[terminalId].terminal.kill();
    }
    
  }
}
