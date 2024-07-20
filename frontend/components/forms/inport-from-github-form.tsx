import { Form } from "@/components/ui/form";
import { FormSchema_Import } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface InportFromGitHubFormProps {}

export function InportFromGitHubForm({}: InportFromGitHubFormProps) {
  const form_import = useForm<z.infer<typeof FormSchema_Import>>({
    resolver: zodResolver(FormSchema_Import),
    defaultValues: {
      githubUrl: "",
    },
  });
  const import_playground = useCallback(
    (data: z.infer<typeof FormSchema_Import>) => {
      console.log(data);
    },
    [],
  );
  return (
    <Form {...form_import}>
      <form
        id="import-github-form"
        onSubmit={form_import.handleSubmit(import_playground)}
      ></form>
    </Form>
  );
}
