import { atom } from "recoil";

type File = {
  name: string;
  type: string;
  path: string;
  content?: string;
  lang?: string;
} | null;

export const currentFileAtom = atom<File>({
  key: "currentFile",
  default: null,
});
