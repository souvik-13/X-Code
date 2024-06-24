// import React from "react";
// import { FolderIcon } from "lucide-react";

// export const IconProvider = ({
//   isFolder,
//   name,
// }: {
//   isFolder: boolean;
//   name: string;
// }) => {
//   if (isFolder) {
//     return <FolderIcon />;
//   }

//   const extension = name.split(".").pop();

//   switch (extension) {
//     case "ts":
//     case "tsx":
//       return <TsIcon />;
//     case "js":
//     case "jsx":
//       return <JsIcon />;
//     case "json":
//       return <JsonIcon />;
//     case "css":
//       return <CssIcon />;
//     case "html":
//       return <HtmlIcon />;
//     case "md":
//       return <MdIcon />;
//     case "png":
//     case "jpg":
//     case "jpeg":
//     case "gif":
//     //   return <ImageIcon />;
//     case "svg":
//       return <SvgIcon />;
//     case "pdf":
//       return <PdfIcon />;
//     case "zip":
//     case "rar":
//     case "tar":
//       return <ZipIcon />;
//     case "txt":
//       return <TxtIcon />;
//     default:
//       return <FileIcon />;
//   }
// };
