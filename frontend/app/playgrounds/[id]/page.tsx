"use client";
import { Suspense, useEffect, useRef, useState } from "react";

import Navbar from "@/components/Navbar";
import Explorer from "@/components/Explorer";
import Outputs from "@/components/Outputs";
import Terminals from "@/components/Terminals";
import Editor from "@/components/Editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import { useSocket } from "@/hooks/useSocket";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectInfoAtom } from "@/store/atoms/playground/projectInfo";
import { SocketProvider, useSocket } from "@/context/socket-provider";

export default function Page({ params }: { params: { id: string } }) {
  const [podCreated, setPodCreated] = useState(false);
  const [projectInfo, setProjectInfo] = useRecoilState(projectInfoAtom);

  useEffect(() => {
    setTimeout(() => {
      setPodCreated(true);
      setProjectInfo({
        name: params.id,
        description: "A playground for testing code",
      });
    }, 0);
  }, [setPodCreated, setProjectInfo, params.id]);

  return (
    <main>
      <Suspense fallback={<BeforeBooting />}>
        {podCreated ? (
          <SocketProvider playgroundId={params.id}>
            <CoadingPage playgroundId={params.id} />
          </SocketProvider>
        ) : (
          <BeforeBooting />
        )}
      </Suspense>
    </main>
  );
}

function BeforeBooting() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <h1>Creating pod...</h1>
    </div>
  );
}

function CoadingPage(params: { playgroundId: string }) {
  const projectInfo = useRecoilValue(projectInfoAtom);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();

  // panel states
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);

  return (
    isConnected && (
      <main className="w-screen h-screen flex flex-col items-center justify-center ">
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
                <Editor  />
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
