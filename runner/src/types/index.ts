export interface NodeType {
    isFolder: boolean;
    path: string;
    name: string;
    children?: NodeType[];
  };