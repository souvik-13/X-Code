import { FileNode } from "@/types";
import { atom } from "recoil";

export const selectedFileAtom = atom<FileNode | null>({
  key: "selectedFile",
  default: null,
});
