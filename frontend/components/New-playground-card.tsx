"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { folderNameSchema } from "@/types/zod-types";
import { randomNameGenerator } from "@/lib/random-name-generator";
import axios from "axios";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { projectNameAtom } from "@/store/atoms";
import { Textarea } from "@/components/ui/textarea";

type FrameWork = {
  value: string;
  label: string;
  available: boolean;
  template?: string;
};

const frameworks: FrameWork[] = [
  { value: "empty", label: "Empty", available: true, template: "" },
  { value: "github", label: "GitHub", available: false, template: "" },
  {
    value: "node.js",
    label: "Node.js",
    available: true,
    template: "nodejs-base",
  },
  { value: "react", label: "React", available: true, template: "vite-react" },
  {
    value: "next.js",
    label: "Next.js",
    available: false,
    template: "nextjs-base",
  },
  { value: "cpp", label: "C++", available: true, template: "cpp-base" },
  { value: "rust", label: "Rust", available: true, template: "rust-base" },
  { value: "go", label: "Go", available: false, template: "" },
  {
    value: "python",
    label: "Python",
    available: true,
    template: "python-base",
  },
] as const;

const FormSchema = z.object({
  projectName: folderNameSchema,
  frameWork: z.string({
    required_error: "Please select a framework.",
  }),
  description: z.string(),
});

export default function NewPlaygroundCard() {
  const [open, setOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useRecoilState(projectNameAtom);
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: randomNameGenerator(),
      frameWork: "react",
      description: "",
    },
  });

  useEffect(() => {
    setStatus("idle");
  }, []);

  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      console.log("onSubmit", data, status);
      if (status === "loading") return;
      else if (status === "success") {
        router.push(`/playgrounds/${data.projectName}`);
      } else if (status === "error") {
        toast.error("Error creating project ❌");
      } else {
        setStatus("loading");
        toast.promise(
          axios
            .post("/api/project/setup", {
              projectName: data.projectName,
              framework: data.frameWork,
              templateName: frameworks.find(
                (framework) => framework.value === data.frameWork
              )?.template,
            })
            .then((res) => {
              setStatus("success");
              setProjectName(data.projectName);
            })
            .catch((err) => {
              setStatus("error");
            }),
          {
            loading: "Creating project...",
            success: () => {
              return "Project created successfully ✅";
            },
            error: () => {
              return "Error creating project ❌";
            },
          }
        );
      }
    },
    [status, setProjectName, router]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Name"
                  className="input"
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription className=" text-sm">
                This is the name of the project folder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frameWork"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Framework</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? frameworks.find(
                            (framework) => framework.value === field.value
                          )?.label
                        : "Select framework"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          value={framework.label}
                          key={framework.value}
                          onSelect={() => {
                            form.setValue("frameWork", framework.value);
                            // close the popover
                            setOpen(false);
                          }}
                          disabled={!framework.available}
                        >
                          {/* <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              framework.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          /> */}
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription className=" text-sm">
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description of the project"
                  className=" resize-none"
                />
              </FormControl>
              <FormDescription className=" text-sm">
                This is the description of the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading"
            ? "Creating playground..."
            : status === "success"
            ? "Playground created \n click to redirect ->"
            : "Create Playground"}
        </Button>
      </form>
    </Form>
  );
}
