import { useRecoilValue } from "recoil";
import { projectNameAtom } from "../atoms/projectName";

export const useProjectName = () => {
  const value = useRecoilValue(projectNameAtom);
  return value;
};