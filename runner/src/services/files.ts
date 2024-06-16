import fs from "node:fs";
import path from "node:path";

interface Node {
  type: "file" | "dir";
  name: string;
  path: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<Node[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, nodes) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          nodes.map((node) => ({
            type: node.isDirectory() ? "dir" : "file",
            name: node.name,
            path: `${baseDir}/${node.name}`,
          })),
        );
      }
    });
  });
};

export const fetchFileContent = (
  filePath: string,
  baseDir: string = "",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(baseDir, filePath), "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const saveFile = async (
  filePath: string,
  content: string,
  baseDir: string = "",
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(baseDir, filePath), content, "utf8", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const createDir = async (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const deleteFile = async (file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export type FileTree = (
  | { name: string; type: string; path: string; children: FileTree }
  | { name: string; type: string; path: string; children?: undefined }
)[];

export const filesTree = async (
  dir: string,
  baseDir = "",
): Promise<FileTree> => {
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  const tree = await Promise.all(
    files.map(async (file) => {
      const path = `${dir}/${file.name}`;
      // Fix: Normalize path separators for cross-platform compatibility
      const relativePath = baseDir ? `${baseDir}/${file.name}` : file.name;
      if (file.isDirectory()) {
        return {
          name: file.name,
          type: "dir",
          path: `${relativePath}/`,
          children: await filesTree(path, relativePath),
        };
      } else {
        return {
          name: file.name,
          type: "file",
          path: relativePath,
        };
      }
    }),
  );

  // sort nodes by type and name. The dirs will be first, then the files and they will be sorted by name
  tree.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "dir" ? -1 : 1;
  });

  return tree;
};
