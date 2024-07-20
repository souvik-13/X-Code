import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { adjectives, fruits } from "@/constants";
import Chance from "chance";
const chance = new Chance();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomNameGenerator = (): string => {
  const randomAdjective =
    adjectives[chance.integer({ min: 0, max: adjectives.length - 1 })];
  const randomFruit =
    fruits[chance.integer({ min: 0, max: fruits.length - 1 })];

  const randomColorName = chance.color({ format: "name" });
  const randomAnimal = chance.animal({ type: "pet" });

  const rnadomName =
    (chance.bool() ? randomAdjective : randomColorName) +
    " " +
    (chance.bool() ? randomFruit : randomAnimal);
  // replace the space with a dash
  return rnadomName.replace(/ /g, "-");
};

export const findLang = (fileName: string): string => {
  const ext = fileName.split(".").pop();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "cjs":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "rs":
      return "rust";
    case "go":
      return "go";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "sass":
      return "sass";
    case "less":
      return "less";
    case "json":
      return "json";
    case "xml":
      return "xml";
    case "svg":
      return "xml";
    case "yaml":
      return "yaml";
    case "toml":
      return "toml";
    case "sql":
      return "sql";
    case "sh":
      return "shell";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
};
