import { NodeType } from "@/types";
import { atom } from "recoil";


export const fileTreeAtom = atom<NodeType[]>({
  key: "fileTree",
  default: [],
});
