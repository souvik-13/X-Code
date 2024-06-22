import fs from "node:fs";
import path from "node:path";

type NodeType = {
  isFolder: boolean;
  path: string;
  children?: NodeType[];
};

export const fetchDir = async (
  dir: string,
  baseDir: string = ""
): Promise<NodeType[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.join(baseDir, dir),
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          reject(err);
        }

        const fileTree: NodeType[] = [];
        files.forEach((file) => {
          // replace the baseDir path with ""
          fileTree.push({
            isFolder: file.isDirectory(),
            path: path.relative(baseDir, path.join(file.parentPath, file.name)),
          });
        });

        fileTree.sort((a, b) => {
          if (a.isFolder === b.isFolder) {
            let a_name = a.path.split("/").pop() || "";
            let b_name = b.path.split("/").pop() || "";
            return a_name.localeCompare(b_name);
          }
          return a.isFolder ? -1 : 1;
        });
        resolve(fileTree);
      }
    );
  });
};

fetchDir(".", "/home/souvik/webdev/vite-project").then((data) => {
  console.log(data);
}).catch((err) => {console.log(err)});

export const fetchFileContent = (
  filePath: string,
  baseDir: string = ""
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
  baseDir: string = ""
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
  baseDir = ""
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
    })
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
