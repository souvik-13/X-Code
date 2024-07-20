import { z } from "zod";

export const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});
export type PersonType = z.infer<typeof personSchema>;

export const folderNameSchema = z
  .string()
  .trim() // Remove leading/trailing whitespace
  .min(1) // Must have at least one character
  .refine((str) => !/[/\\?*:<>"]/.test(str), {
    message:
      'Invalid characters. Folder names cannot contain /, \\, ?, *, :, <, >, or " characters',
  });
export type FolderNameType = z.infer<typeof folderNameSchema>;

export const fileNameSchema = z
  .string()
  .trim() // Remove leading/trailing whitespace
  .refine((str) => !/[/\\?*:<>"]/.test(str), {
    message:
      'Invalid characters. File names cannot contain /,\\, ?, *, :, <, >, or " characters',
  })
  .refine((str) => !/\s/.test(str), {
    // Disallow spaces
    message: "File names cannot contain spaces",
  });
export type FileNameType = z.infer<typeof fileNameSchema>;

export const urlSchema = z.string().url();
export type URLType = z.infer<typeof urlSchema>;

export const githubUrlSchema = z
  .string()
  .url()
  .refine((url) => {
    return url.startsWith("https://github.com/");
  });
export type GitHubUrlType = z.infer<typeof githubUrlSchema>;

export const selectFrameworkFormSchema = z.object({
  projectName: folderNameSchema,
  githubUrl: githubUrlSchema.optional(),
  framework: z.string(),
});
export type SelectFrameworkFormType = z.infer<typeof selectFrameworkFormSchema>;

export const FormSchema_Create = z.object({
  projectName: folderNameSchema,
  framework: z.string({
    // required_error: "Please select a framework.",
  }),
  description: z.string(),
  privacy: z.boolean(),
});
export type CreateFormType = z.infer<typeof FormSchema_Create>;

export const FormSchema_Import = z.object({
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
export type ImportFormType = z.infer<typeof FormSchema_Import>;
