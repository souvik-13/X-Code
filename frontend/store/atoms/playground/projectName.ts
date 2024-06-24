import { atom } from "recoil";


export const projectNameAtom = atom<string>({
  key: "projectName",
  default: "",
});
