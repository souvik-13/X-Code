import { useRecoilValue } from "recoil";
import { gitHubLinkAtom } from "../atoms/playground/gitHubLink";

export const useGitHubLink = () => {
  const value = useRecoilValue(gitHubLinkAtom);
  return value;
};
