import { useRecoilValue } from "recoil";
import { gitHubLinkAtom } from "../atoms/gitHubLink";

export const useGitHubLink = () => {
  const value = useRecoilValue(gitHubLinkAtom);
  return value;
};