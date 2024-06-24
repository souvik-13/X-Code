import { atom } from "recoil";

export const gitHubLinkAtom = atom<string>({
  key: "gitHubLink",
  default: "",
});