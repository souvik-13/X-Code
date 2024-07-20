import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./styles.css";


interface DirectoryTreeViewProps {
  folder: any;

  // funcions
  onSelect?: (selected: any) => void;
  onNodeSelect?: (node: any) => void;

  // options
  propagateSelect?: boolean;
  propagateCollapse?: boolean;
  multiSelect?: boolean;
  togglableSelect?: boolean;
  clickAction?: "EXCLUSIVE_SELECT" | "TOGGLE_SELECT";
}

function DirectoryTreeView({ folder }: DirectoryTreeViewProps) {
  const data = flattenTree(folder);

  return (
    <div>
      <div className="ide">
        <TreeView
          data={data}
          aria-label="directory tree"
          propagateSelect={false}
          propagateCollapse={false}
          multiSelect
          togglableSelect
          clickAction="EXCLUSIVE_SELECT"
          onSelect={(selected) => console.log("onSelect", selected)}
          onNodeSelect={(node) => console.log("onNodeSelect", node)}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            getNodeProps,
            level,
            handleSelect,
          }) => (
            <div
              {...getNodeProps()}
              style={{ paddingLeft: 20 * (level - 1) }}
              className={cn("flex items-center gap-1 cursor-pointer group", {
                "bg-accent/50": isSelected,
              })}
            >
              <Icon.chevron
                strokeWidth={1.25}
                size={16}
                direction={isExpanded ? "down" : "right"}
                className={cn({ invisible: !isBranch })}
              />
              <div className="flex items-center gap-2">
                {isBranch ? (
                  <Icon.folder
                    folderPath={element.name}
                    expanded={isExpanded}
                    className="size-4"
                  />
                ) : (
                  <Icon.file filePath={element.name} className="size-4" />
                )}
                <span className="text-muted-foreground group-hover:text-foreground text-sm">
                  {element.name}
                </span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default DirectoryTreeView;
