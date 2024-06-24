export interface NodeType {
    isFolder: boolean;
    path: string;
    children?: NodeType[];
  };