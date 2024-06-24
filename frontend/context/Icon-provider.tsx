// import {
//   useContext,
//   createContext,
//   ReactNode,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { FileIcon, } from "lucide-react";

// interface IconProviderContextType {
//   icons: Record<string, ReactNode>;
// }

// const IconProviderContext = createContext<IconProviderContextType | null>(null);

// export const useIconProvider = () => {
//   const context = useContext(IconProviderContext);
//   if (!context) {
//     throw new Error("useIconProvider must be used within a IconProvider");
//   }
//   return context;
// };

// interface IconProviderProps {
//   children: ReactNode;
// }

// export const IconProvider = ({ children }: IconProviderProps) => {
//   const [icons, setIcons] = useState<Record<string, ReactNode>>({});

//   useEffect(() => {
//     const icons = {
//       FileIcon: <FileIcon />,
//       ChevronRightIcon: <ChevronRightIcon />,
//       FolderIcon: <FolderIcon />,
//       ChevronDownIcon: <ChevronDownIcon />,
//       FolderOpenIcon: <FolderOpenIcon />,
//     };
//     setIcons(icons);
//   }, []);

//   return (
//     <IconProviderContext.Provider value={{ icons }}>
//       {children}
//     </IconProviderContext.Provider>
//   );
// };
