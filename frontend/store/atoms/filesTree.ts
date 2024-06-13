import { atom } from "recoil";

export const filesTreeAtom = atom<string>({
  key: "filesTree",
  default: "",
});