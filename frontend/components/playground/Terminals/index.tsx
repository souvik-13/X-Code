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
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { CanvasAddon } from "@xterm/addon-canvas";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Unicode11Addon } from "@xterm/addon-unicode11";
import { useRecoilValue } from "recoil";
import { projectInfoAtom } from "@/store/atoms/playground/projectInfo";
import { toast } from "sonner";

import "./terminal.css";
import { useSocket } from "@/context/socket-provider";
import { themes } from "@/lib/terminal-theme";
import { useThrottle } from "@/hooks/useThrottle";

interface TerminalsProps {
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
  terminalOpen,
  collapse,
  expand,
  playgroundId,
}: TerminalsProps) => {
  const {
    isConnected,
    workspaceLoaded,
    requestTerminal,
    killTerminalReq,
    sendTerminalData,
    sendTerminalDataBin,
    recTerminalData,
  } = useSocket();

  // const projectInfo = useRecoilValue(projectInfoAtom);
  const collapseTerminals = useCallback(() => {
    // collapse();
  }, []);
  const expandTerminals = useCallback(() => {
    // expand();
  }, []);

  const [terminals, setTerminals] = useState<
    { pid?: string; term?: Terminal; color?: string }[]
  >(Array(9).fill({}));

  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);

  useEffect(() => {
    console.log("active terminal", activeTerminal);
  }, [activeTerminal]);

  const createTerminal = useCallback(() => {
    if (!isConnected) {
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
      cols: 100,
      // rows: 30,

      fontSize: 14,
      fontFamily: "'FiraCode Nerd Font', monospace",
      theme: themes["night-owl"],
    });

    console.log(themes["night-owl"]);

    const fitAddon = new FitAddon();
    const canvasAddon = new CanvasAddon();
    const webLinksAddon = new WebLinksAddon();
    // const unicode11Addon = new Unicode11Addon();
    term.loadAddon(fitAddon);
    term.loadAddon(canvasAddon);
    term.loadAddon(webLinksAddon);
    // term.loadAddon(unicode11Addon);

    // term.unicode.activeVersion = "11";

    requestTerminal(index, playgroundId);

    term.open(document.getElementById(`term-${index}`) as HTMLDivElement);

    const handleResize = () => {
      fitAddon.fit();
    };

    // Use ResizeObserver to resize the terminal on div element resize
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    // Start observing the terminalElement for size changes
    resizeObserver.observe(
      document.getElementById(`term-${index}`) as HTMLDivElement
    );

    term.onData((data: any) => {
      // console.log("data", data);
      sendTerminalData(index, data);
    });

    term.onBinary((data: any) => {
      // console.log("binary data", data);
      sendTerminalDataBin(index, data);
    });

    setTerminals((prev) => {
      const newTerminals = [...prev];
      newTerminals[index] = { term, color: termColors[index] };
      console.log("created terminal", index, newTerminals);
      return newTerminals;
    });
    setActiveTerminal(index.toString());
  }, [playgroundId, isConnected, terminals]);

  const killTerminal = useCallback(
    (index: number) => {
      if (!isConnected) {
        console.log("socket not connected");
        return;
      }

      // const index = terminals.findIndex((terminal) => terminal.term);
      // if (index === -1) {
      //   console.log("No available terminal");
      //   return;
      // }

      killTerminalReq(index);

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
    [isConnected]
  );

  // listen for terminal data from server
  useEffect(() => {
    if (!isConnected) return;

    const index = terminals.findIndex((terminal) => !terminal.term);
    if (index === -1) return;

    recTerminalData(({ terminalId, terminalData, pid }) => {
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
      // socket.off("terminal-data");
    };
  }, [isConnected, terminals, createTerminal, activeTerminal]);

  // load terminal when workspace is ready
  useEffect(() => {
    if (!isConnected) return;
    if (workspaceLoaded) {
      if (!activeTerminal) createTerminal();
    }
  }, [isConnected, createTerminal, activeTerminal, workspaceLoaded]);

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
                    activeTerminal === index.toString()
                      ? `${terminal.color}_active`
                      : terminal.color
                  )}
                  onClick={() => {
                    setActiveTerminal(index.toString());
                  }}
                >
                  <TerminalIcon className="text-foreground" />
                  <XIcon
                    size={20}
                    strokeWidth={2}
                    className={cn(
                      "flex-none cursor-pointer hover:bg-accent-foreground/20 group-hover:block opacity-0 group-hover:opacity-100"
                    )}
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
      <div id="terminal-container" className="w-full h-full relative">
        {workspaceLoaded ? (
          terminals.map((terminal, index) => {
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
          })
        ) : (
          <div className="w-full h-full grid place-items-center">
            <h1 className="animate-pulse">Loading...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminals;
