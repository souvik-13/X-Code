import { atom } from "recoil";

export const themeAtom = atom<string>({
  key: "theme",
  default: "night-owl",
});