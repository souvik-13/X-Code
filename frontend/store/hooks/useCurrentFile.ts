import { useRecoilValue } from "recoil";
import { currentFileAtom } from "../atoms/playground/explorer/Files/selectedFile";

export const useCurrentFile = () => {
  const value = useRecoilValue(currentFileAtom);
  return value;
};
