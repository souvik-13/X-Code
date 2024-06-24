import { useRecoilValue } from "recoil";
import { fileTreeAtom } from "../atoms/playground/explorer/Files/fileTree";

export const useFileTree = () => {
  const value = useRecoilValue(fileTreeAtom);
  return value;
};
