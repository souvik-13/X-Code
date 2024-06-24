export interface NodeType  {
  isFolder: boolean;
  path: string;
  children?: NodeType[];
};

export interface FileNode extends NodeType {
  lang?: string;
  content?: string;
};