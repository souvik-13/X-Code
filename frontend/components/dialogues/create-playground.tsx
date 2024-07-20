"use client";
import { CreatePlaygroundForm } from "@/components/forms/create-playground-form";
import { InportFromGitHubForm } from "@/components/forms/inport-from-github-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface CreatePlaygroundDialogueProps {
  children: React.ReactNode;
  type: "create" | "import";
}

function CreatePlaygroundDialogue({
  children,
  type,
}: CreatePlaygroundDialogueProps) {
  const [_type, setType] = useState(type);

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex  md:max-w-2xl flex-col gap-4">
        <DialogHeader>
          <div className="flex w-full items-center justify-between px-4">
            <h1 className="font-heading text-xl">
              {_type === "create" ? "Create Playground" : "Import from GitHub"}
            </h1>

            <Button
              variant="secondary"
              size={"sm"}
              className="text-muted-foreground animate-in animate-out"
              onClick={(e) => {
                e.preventDefault();
                setType((prev) => (prev === "create" ? "import" : "create"));
              }}
            >
              {_type !== "create" ? "Create Playground" : "Import from GitHub"}
            </Button>
          </div>
        </DialogHeader>
        {_type === "create" ? (
          <CreatePlaygroundForm />
        ) : (
          <InportFromGitHubForm />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlaygroundDialogue;
