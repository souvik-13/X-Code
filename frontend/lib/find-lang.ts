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