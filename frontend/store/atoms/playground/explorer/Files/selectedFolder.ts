import { NodeType } from "@/types";
import { atom } from "recoil";

export const selectedFolderAtom = atom<NodeType | null>({
  key: "selectedFolder",
  default: null,
});
