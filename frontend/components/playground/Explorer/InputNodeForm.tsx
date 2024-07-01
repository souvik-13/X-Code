import { ChangeEventHandler, KeyboardEventHandler } from "react";
import { Input } from "../../ui/input";
import { z } from "zod";
import { fileNameSchema, folderNameSchema } from "@/types/zod-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  nodeName: folderNameSchema || fileNameSchema,
});

const InputNodeForm = ({
  isFolder,
  className,
  ref,
  value,
  type,
  onChange,
  onKeyDown,
}: {
  isFolder: boolean;
  className: string;
  ref: React.Ref<HTMLInputElement>;
  value: string;
  type: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined;
}) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nodeName: value,
    },
  });

  const { register, handleSubmit } = form;

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="nodeName"
        render={() => (
          <FormItem>
            <FormControl>
              <Input
                // ref={ref}/
                value={value}
                type={type}
                className={className}
                {...register("nodeName")}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};
