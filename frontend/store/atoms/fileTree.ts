import { atom } from "recoil";

type FileTree = (
  | { name: string; type: string; path: string; children: FileTree }
  | { name: string; type: string; path: string; children?: undefined}
)[];

export const fileTreeAtom = atom<FileTree>({
  key: "fileTree",
  default: [],
});
