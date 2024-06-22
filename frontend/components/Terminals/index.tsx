"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TerminalIcon,
  TerminalSquare,
  XIcon,
} from "lucide-react";
import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { CanvasAddon } from "@xterm/addon-canvas";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Unicode11Addon } from "@xterm/addon-unicode11";
import { useRecoilValue } from "recoil";
import { projectInfoAtom } from "@/store/atoms/projectInfo";
import { toast } from "sonner";

import "./terminal.css"

interface TerminalsProps {
  socket: Socket;
  terminalOpen: boolean;
  playgroundId: string;
  collapse?: () => void;
  expand?: () => void;
}

const termColors = [
  "term_red",
  "term_green",
  "term_blue",
  "term_yellow",
  "term_purple",
  "term_cyan",
  "term_orange",
  "term_pink",
] as const;


function ab2str(buffer: Buffer | ArrayBuffer) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
}

const Terminals = ({
  socket,
  terminalOpen,
  collapse,
  expand,
  playgroundId,
}: TerminalsProps) => {
  // const projectInfo = useRecoilValue(projectInfoAtom);
  const collapseTerminals = useCallback(() => {
    // collapse();
  }, []);
  const expandTerminals = useCallback(() => {
    // expand();
  }, []);

  const [loading, setLoading] = useState(true);


  const [terminals, setTerminals] = useState<
    { pid?: string; term?: Terminal; color?: string }[]
  >(Array(9).fill({}));


  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);

  useEffect(() => {
    console.log("active terminal", activeTerminal);
  }, [activeTerminal]);

  const createTerminal = useCallback(() => {
    if (!socket) {
      console.log("socket not connected");
      return;
    }

    const index = terminals.findIndex((terminal) => !terminal.term);

    if (index === -1 || index > 7) {
      toast.error("No available terminal");
      return;
    }
    if (!document.getElementById(`term-${index}`)) {
      console.log("Terminal ref not found");
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      // cols: 100,
      // rows: 30,
      fontSize: 14,
      fontFamily: "consolas",
      theme: {
        background: "#000",
        foreground: "#fff",
      },
    });
    const fitAddon = new FitAddon();
    const canvasAddon = new CanvasAddon();
    const webLinksAddon = new WebLinksAddon();
    // const unicode11Addon = new Unicode11Addon();
    term.loadAddon(fitAddon);
    term.loadAddon(canvasAddon);
    term.loadAddon(webLinksAddon);
    // term.loadAddon(unicode11Addon);

    // term.unicode.activeVersion = "11";

    socket.emit("request-terminal", {
      terminalId: index,
      playgroundId,
    });

    term.open(document.getElementById(`term-${index}`) as HTMLDivElement);
    fitAddon.fit();

    // Use ResizeObserver to resize the terminal on div element resize
    const resizeObserver = new ResizeObserver(() => {
      console.log("resizing terminal", index);
      fitAddon.fit();
    });

    // Start observing the terminalElement for size changes
    resizeObserver.observe(
      document.getElementById(`term-${index}`) as HTMLDivElement,
    );

    term.onData((data: any) => {
      // console.log("data", data);
      socket.emit("terminal-data", {
        terminalId: index,
        data: data,
      });
    });

    term.onBinary((data: any) => {
      console.log("binary data", data);
      socket.emit("terminal-data", {
        terminalId: index,
        data: data,
      });
    });

    setTerminals((prev) => {
      const newTerminals = [...prev];
      newTerminals[index] = { term, color: termColors[index] };
      console.log("created terminal", index, newTerminals);
      return newTerminals;
    });
    setActiveTerminal(index.toString());
  }, [playgroundId, socket, terminals]);

  const killTerminal = useCallback(
    (index: number) => {
      if (!socket) {
        console.log("socket not connected");
        return;
      }

      // const index = terminals.findIndex((terminal) => terminal.term);
      // if (index === -1) {
      //   console.log("No available terminal");
      //   return;
      // }

      socket.emit("kill-terminal", { terminalId: index });

      if (index === 0) {
        if (terminals[1].term) {
          setActiveTerminal("1");
        } else {
          setActiveTerminal(null);
        }
      } else {
        setActiveTerminal(`${index - 1}`);
      }

      setTerminals((prev) => {
        const newTerminals = [...prev];
        newTerminals[index] = {};
        console.log("killed terminal", index, newTerminals);
        return newTerminals;
      });
    },
    [socket],
  );

  // listen for terminal data from server
  useEffect(() => {
    if (!socket) return;

    const index = terminals.findIndex((terminal) => !terminal.term);
    if (index === -1) return;

    socket.on("terminal-data", (data) => {
      const { terminalId, terminalData, pid } = data;
      if (!terminals[terminalId]) {
        console.log("Terminal not found");
        return;
      }
      let term = terminals[terminalId].term;
      if (term) {
        term.write(ab2str(terminalData));
      } else {
        console.log("Terminal not found");
      }
    });
    return () => {
      socket.off("terminal-data");
    };
  }, [socket, terminals, createTerminal, activeTerminal]);

  // load terminal when workspace is ready
  useEffect(() => {
    if (!socket) return;
    socket.on("workspace-ready", () => {
      setLoading(false);
      if(!activeTerminal) createTerminal();
    })
  }, [socket, createTerminal, activeTerminal]);

  return (
    <div className="w-full h-full">
      {/* terminal bar */}
      <div className="w-full h-8 flex items-center justify-start bg-accent relative">
        <div
          className=" w-min h-full overflow-x-scroll flex-shrink flex items-center justify-start gap-1"
          style={{ scrollbarWidth: "none" }}
        >
          {terminals.map((terminal, index) => {
            return (
              terminal.term && (
                <div
                  id={`termIcon-${index}`}
                  key={index}
                  className={cn(
                    "h-full w-max px-4 flex items-center justify-end gap-2 text-sm  cursor-pointer group",
                    activeTerminal === index.toString() ? `${terminal.color}_active` : terminal.color,

                  )}
                  onClick={() => {
                    setActiveTerminal(index.toString());
                  }}
                >
                  <TerminalIcon className="text-foreground" />
                  <XIcon
                    size={20}
                    strokeWidth={2}
                    className={cn("flex-none cursor-pointer hover:bg-accent-foreground/20 group-hover:block opacity-0 group-hover:opacity-100")}
                    onClick={() => {
                      killTerminal(index);
                    }}
                  />
                </div>
              )
            );
          })}
        </div>
        <TerminalSquare
          size={20}
          strokeWidth={2}
          className="ml-4 mx-10 flex-none cursor-pointer"
          onClick={createTerminal}
        />
        {terminalOpen ? (
          <ChevronDownIcon
            size={20}
            strokeWidth={2}
            className=" absolute end-2"
            onClick={collapseTerminals}
          />
        ) : (
          <ChevronUpIcon
            size={20}
            strokeWidth={2}
            className=" absolute end-2"
            onClick={expandTerminals}
          />
        )}
      </div>
      {/* terminals */}
      <div className="w-full h-full relative">
        {terminals.map((terminal, index) => {
          return (
            <div
              key={index}
              id={`term-${index}`}
              // id="term-0"
              // ref={(element) => assignTerminalRef(element!, index)}
              className={cn("absolute top-0 bottom-0 left-0 right-0", {
                hidden: !terminal.term || activeTerminal !== index.toString(),
              })}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Terminals;
