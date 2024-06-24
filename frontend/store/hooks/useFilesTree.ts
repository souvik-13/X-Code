import { useRecoilValue } from "recoil";
import { filesTreeAtom } from "../atoms/playground/explorer/Files/filesTree";

export const useFilesTree = () => {
  const value = useRecoilValue(filesTreeAtom);
  return value;
};
