import { useRecoilValue } from "recoil";
import { filesTreeAtom } from "../atoms/filesTree";

export const useFilesTree = () => {
  const value = useRecoilValue(filesTreeAtom);
  return value;
};