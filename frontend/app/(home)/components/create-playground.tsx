"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { frameworks } from "@/data";
import { randomNameGenerator } from "@/lib/random-name-generator";
import { cn } from "@/lib/utils";
import { folderNameSchema } from "@/types/zod-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreatePlaygroundDialogueProps {
  children: React.ReactNode;
  type: "create" | "import";
}
const FormSchema_Create = z.object({
  projectName: folderNameSchema,
  framework: z.string({
    // required_error: "Please select a framework.",
  }),
  description: z.string(),
  private: z.boolean(),
});

const FormSchema_Import = z.object({
  githubUrl: z
    .string({
      required_error: "Please enter a GitHub URL.",
    })
    .url({
      message: "Please enter a valid URL.",
    })
    .refine((url) => {
      if (url.includes("github.com")) {
        return true;
      }
      return false;
    }, "Please enter a valid GitHub URL."),
});

function CreatePlaygroundDialogue({
  children,
  type,
}: CreatePlaygroundDialogueProps) {
  const [_type, setType] = useState(type);

  const form_create = useForm<z.infer<typeof FormSchema_Create>>({
    resolver: zodResolver(FormSchema_Create),
    defaultValues: {
      projectName: randomNameGenerator(),
      private: false,
    },
  });

  const form_import = useForm<z.infer<typeof FormSchema_Import>>({
    resolver: zodResolver(FormSchema_Import),
    defaultValues: {
      githubUrl: "",
    },
  });

  const create_playground = useCallback(
    (data: z.infer<typeof FormSchema_Create>) => {
      console.log(data);
    },
    [],
  );

  const import_playground = useCallback(
    (data: z.infer<typeof FormSchema_Import>) => {
      console.log(data);
    },
    [],
  );
  const [frameworkSelectorOpen, setFrameworkSelectorOpen] = useState(false);

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
          <Form {...form_create}>
            <form onSubmit={form_create.handleSubmit(create_playground)}>
              <div className="flex flex-col items-stretch md:flex-row gap-4">
                <div className="md:basis-1/2 box-border flex flex-col items-stretch gap-4 border-0 border-solid outline-none">
                  <div className="box-border flex h-full min-h-0 min-w-0 shrink-0 basis-auto flex-col items-stretch gap-2 border-0 border-solid">
                    <FormField
                      control={form_create.control}
                      name="framework"
                      render={({ field, fieldState, formState }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Framework</FormLabel>
                          <Popover
                            open={frameworkSelectorOpen}
                            onOpenChange={setFrameworkSelectorOpen}
                          >
                            <PopoverTrigger>
                              <FormControl>
                                <div
                                  className={cn(
                                    buttonVariants({
                                      variant: "outline",
                                      size: "default",
                                    }),
                                    "w-full flex justify-between outline-none focus:ring-1",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? frameworks.find(
                                        (framework) =>
                                          framework.value === field.value,
                                      )?.label
                                    : "Select framework"}
                                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search framework..." />
                                <CommandEmpty>No framework found</CommandEmpty>
                                <CommandGroup>
                                  {frameworks.map((framework) => (
                                    <CommandItem
                                      disabled={!framework.available}
                                      value={framework.label}
                                      key={framework.value}
                                      onSelect={() => {
                                        form_create.setValue(
                                          "framework",
                                          framework.value,
                                          { shouldValidate: true },
                                        );
                                        setFrameworkSelectorOpen(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          framework.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {framework.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="box-border flex min-h-0 min-w-0 flex-auto flex-col items-stretch gap-4 border-0 border-solid"></div>
                </div>
                <div className="box-border flex flex-auto flex-col border-0 border-solid outline-none  max-w-md">
                  <FormField
                    control={form_create.control}
                    name="projectName"
                    render={({ field, fieldState, formState }) => (
                      <FormItem className="items-stretch box-border flex basis-auto shrink-0 min-h-0 min-w-0 flex-col gap-2 border-0 border-solid">
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full"
                            placeholder="Project Name"
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form_create.control}
                    name="private"
                    render={({ field, fieldState, formState }) => (
                      <FormItem className="items-stretch box-border flex basis-auto shrink-0 min-h-0 min-w-0 flex-row gap-2 border my-4 py-2 px-3 border-solid rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Private Playground
                          </FormLabel>
                          <FormDescription>
                            Make your playground private. Only you can view it.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div></div>
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...form_import}>
            {" "}
            <form onSubmit={form_import.handleSubmit(import_playground)}></form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlaygroundDialogue;
