import { useRecoilValue } from "recoil";
import { nameAtom } from "../atoms/user/name";

export const useName = () => {
  const value = useRecoilValue(nameAtom);
  return value;
};
