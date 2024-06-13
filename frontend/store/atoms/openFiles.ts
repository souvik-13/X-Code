import { atom } from "recoil";

type File = {
  name: string;
  type: string;
  path: string;
  content?: string;
  lang?: string;
};

export const openFilesAtom = atom<File[]>({
  key: "openFiles",
  default: [],
});
