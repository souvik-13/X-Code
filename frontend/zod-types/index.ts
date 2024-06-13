import { z } from "zod";

export const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});
export type PersonType = z.infer<typeof personSchema>;

export const folderNameSchema = z
  .string()
  .trim() // Remove leading/trailing whitespace
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
