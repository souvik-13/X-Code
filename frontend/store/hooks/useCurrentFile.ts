import { useRecoilValue } from "recoil";
import { currentFileAtom } from "../atoms/currentFile";

export const useCurrentFile = () => {
  const value = useRecoilValue(currentFileAtom);
  return value;
};