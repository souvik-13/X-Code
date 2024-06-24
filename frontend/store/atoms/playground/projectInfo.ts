import { atom } from "recoil";

interface ProjectInfo {
  name: string;
  description: string;
  createdAt?: Date;
  lastUpdated?: Date;
  framework?: string;
  gitHubUrl?: string;
}

export const projectInfoAtom = atom<ProjectInfo>({
  key: "projectInfo",
  default: {
    name: "",
    description: "",
  },
});
