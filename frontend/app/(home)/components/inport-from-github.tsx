"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import CreatePlaygroundDialogue from "../../../components/dialogues/create-playground";

interface ImportFromGitHubProps {
  children: React.ReactNode;
}

function ImportFromGitHub({ children }: ImportFromGitHubProps) {
  const [dOpen, setDOpen] = useState(false);
  return (
    <Dialog open={dOpen} onOpenChange={setDOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex w-full items-center justify-between px-4">
            <h1 className="font-heading text-xl">Import from GitHub</h1>
            <div
              className=""
              onClick={(e) => {
                e.preventDefault();
                setDOpen(false);
              }}
            >
              <CreatePlaygroundDialogue>
                <Button
                  variant="secondary"
                  size={"sm"}
                  className="text-muted-foreground animate-in animate-out"
                >
                  Create Playground
                </Button>
              </CreatePlaygroundDialogue>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ImportFromGitHub;
