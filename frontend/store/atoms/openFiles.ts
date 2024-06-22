import { NodeType } from "@/types";
import { atom } from "recoil";

interface CurrentFile extends NodeType {
  lang?: string;
  content?: string;
}

export const openFilesAtom = atom<CurrentFile[]>({
  key: "openFiles",
  default: [],
});
