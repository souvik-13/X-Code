import { useRecoilValue } from "recoil";
import { fileTreeAtom } from "../atoms/fileTree";

export const useFileTree = () => {
  const value = useRecoilValue(fileTreeAtom);
  return value;
};