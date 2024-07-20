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
import { cn, randomNameGenerator } from "@/lib/utils";
import { FormSchema_Create } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CreatePlaygroundFormProps {}

export function CreatePlaygroundForm({}: CreatePlaygroundFormProps) {
  const [frameworkSelectorOpen, setFrameworkSelectorOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema_Create>>({
    resolver: zodResolver(FormSchema_Create),
    defaultValues: {
      projectName: randomNameGenerator(),
      description: "",
      privacy: false,
    },
  });

  const create_playground = useCallback(
    (data: z.infer<typeof FormSchema_Create>) => {
      axios.post("/api/playground/setup", data).then((res) => {
        console.log(res.data);
        toast.custom(() => (
          <pre>
            <code>
              {JSON.stringify({ data: res.data, status: res.status }, null, 2)}
            </code>
          </pre>
        ));
      });
    },
    [],
  );

  return (
    <Form {...form}>
      <form
        id="create-playground-form"
        onSubmit={form.handleSubmit(create_playground)}
        className="outline-none"
      >
        <div className="flex flex-col items-stretch md:flex-row gap-4">
          <div className="md:basis-1/2 box-border flex flex-col items-stretch gap-4 border-0 border-solid outline-none">
            <div className="box-border flex h-full min-h-0 min-w-0 shrink-0 basis-auto flex-col items-stretch gap-2 border-0 border-solid">
              <FormField
                control={form.control}
                name="framework"
                render={({ field, fieldState, formState }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Framework</FormLabel>
                    <Popover
                      // defaultOpen
                      open={frameworkSelectorOpen}
                      onOpenChange={setFrameworkSelectorOpen}
                    >
                      <PopoverTrigger
                        className={cn(
                          "outline-none focus:ring-1 rounded ring-ring",
                        )}
                        autoFocus
                      >
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
                                  form.setValue("framework", framework.value, {
                                    shouldValidate: true,
                                  });
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
              control={form.control}
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
              control={form.control}
              name="privacy"
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
            <div className=" flex-grow flex flex-col justify-end items-stretch">
              <Button
                type="submit"
                className="w-full"
                form="create-playground-form"
                aria-disabled={true}
              >
                Create Playground
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
