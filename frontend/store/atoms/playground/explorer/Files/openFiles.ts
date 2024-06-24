import { FileNode, NodeType } from "@/types";
import { atom } from "recoil";



export const openFilesAtom = atom<FileNode[]>({
  key: "openFiles",
  default: [],
});
