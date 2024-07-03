import Editor from "@/components/playground/Editor";
import Explorer from "@/components/playground/Explorer";
import Navbar from "@/components/playground/Navbar";
import Terminals from "@/components/playground/Terminals";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSocket } from "@/context/socket-provider";

import { projectInfoAtom } from "@/store/atoms";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";

export function CoadingPage(params: { playgroundId: string }) {
  const projectInfo = useRecoilValue(projectInfoAtom);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();

  // panel states
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);

  return (
    isConnected && (
      <main className="flex h-screen w-screen flex-col items-center justify-center">
        <Navbar />
        <ResizablePanelGroup direction="horizontal" className="mt-12">
          <ResizablePanel
            order={1}
            defaultSize={15}
            minSize={10}
            maxSize={80}
            collapsible
            onCollapse={() => setExplorerOpen(false)}
            onExpand={() => setExplorerOpen(true)}
          >
            <Explorer />
          </ResizablePanel>
          <ResizableHandle className="w-0.5 hover:bg-muted-foreground active:bg-muted-foreground" />
          <ResizablePanel order={2}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel order={3}>
                <Editor />
              </ResizablePanel>
              <ResizableHandle className="hover:bg-muted-foreground active:bg-muted-foreground" />
              <ResizablePanel
                order={4}
                defaultSize={40}
                minSize={15}
                collapsible
                onCollapse={() => setTerminalOpen(false)}
                onExpand={() => setTerminalOpen(true)}
              >
                <Terminals
                  terminalOpen={terminalOpen}
                  playgroundId={params.playgroundId}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="w-0.5 hover:bg-muted-foreground active:bg-muted-foreground" />
          <ResizablePanel
            order={5}
            defaultSize={35}
            minSize={15}
            collapsible
            onCollapse={() => setViewsOpen(false)}
            onExpand={() => setViewsOpen(true)}
          >
            {/* <Outputs socket={socket} /> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    )
  );
}
