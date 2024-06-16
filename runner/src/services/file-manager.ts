import fs from "node:fs";
import path from "node:path";

interface File {
  type: "file" | "dir";
  name: string;
  path: string;
}

export type FileTree = (
  | { name: string; type: string; path: string; children: FileTree }
  | { name: string; type: string; path: string; children?: undefined }
)[];

export default class FileManager {

  _root: string = process.env.HOME ?? ""
  fileTree: FileTree = [];

  constructor() { }


  public set root(rootDir: string) {
    this._root = rootDir;
  }

  

}