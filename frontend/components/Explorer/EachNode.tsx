// const EachNode = ({
//   node,
//   highlight = false,
// }: {
//   node: fileTreeNodeType;
//   highlight?: boolean;
// }) => {
//   const [currentFile, setCurrentFile] = useRecoilState(currentFileAtom);
//   const [openFiles, setOpenFiles] = useRecoilState(openFilesAtom);
//   const [collapsed, setCollapsed] = useState<boolean>(true);
//   return (
//     <div
//       className="h-max transition-all cursor-pointer"
//       onClick={(e) => {
//         e.stopPropagation();
//         setCollapsed(!collapsed);
//       }}
//     >
//       <div
//         className={cn("flex items-center text-sm  transition-all", {
//           "bg-foreground/20": highlight && currentFile?.path === node.path,
//         })}
//         onClick={async (e) => {
//           if (node.type === "file") {
//             setCurrentFile(node as fileType);

//             const isFileOpen = openFiles.some(
//               (file) => file.path === node.path,
//             );
//             if (!isFileOpen) {
//               setOpenFiles((prevFiles) => [...prevFiles, node]);
//             }
//           }
//         }}
//       >
//         {node.type === "file" ? (
//           <div className="pl-4">
//             <File size={16} strokeWidth={1.25} />
//           </div>
//         ) : collapsed ? (
//           <div className="flex items-center">
//             <ChevronRight size={16} strokeWidth={1.25} />
//             <Folder size={16} strokeWidth={1.25} />
//           </div>
//         ) : (
//           <div className="flex items-center">
//             <ChevronDown size={16} strokeWidth={1.25} />
//             <FolderOpenIcon size={16} strokeWidth={1.25} />
//           </div>
//         )}
//         <span className={cn("px-2")}>{node.name}</span>
//       </div>
//       {!collapsed && (
//         <div className="pl-2 flex flex-col gap-1">
//           {node.children?.map((_node, index) => {
//             return <EachNode highlight node={_node} key={index} />;
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
