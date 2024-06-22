import { NodeType } from "@/types";
import { atom } from "recoil";

interface CurrentFile extends NodeType {
  lang?: string;
  content?: string;
}

export const currentFileAtom = atom<CurrentFile | null>({
  key: "currentFile",
  default: null,
});
