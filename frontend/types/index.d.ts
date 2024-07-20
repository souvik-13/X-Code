import {
  CreateFormType,
  FileNameType,
  FolderNameType,
  GitHubUrlType,
  ImportFormType,
  SelectFrameworkFormType,
  URLType,
} from "@/validations";

declare type FolderNameType = FolderNameType;
declare type FileNameType = FileNameType;
declare type URLType = URLType;
declare type GitHubUrlType = GitHubUrlType;
declare type SelectFrameworkFormType = SelectFrameworkFormType;
declare type CreateFormType = CreateFormType;
declare type ImportFormType = ImportFormType;

declare interface NodeType {
  isFolder: boolean;
  name: string;
  path: string;
  children?: NodeType[];
}

declare interface FileNode extends NodeType {
  lang?: string;
  content?: string;
}
