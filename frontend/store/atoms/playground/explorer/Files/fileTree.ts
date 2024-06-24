import { FileNode, NodeType } from "@/types";
import { atom } from "recoil";

export const fileTreeAtom = atom<FileNode | null>({
  key: "fileTree",
  default: null,
});
