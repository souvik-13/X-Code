import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface FilePathBreadcrumbProps {
  children?: React.ReactNode;
  className?: string;
  filePath: string;
}

export const FilePathBreadcrumb = ({
  className,
  filePath,
}: FilePathBreadcrumbProps) => {
  let paths = filePath.split("/");
  let fileName = paths.pop();

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {paths.map((path, index) => {
          return (
            <>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href="#">{path}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
        <BreadcrumbItem>
          <BreadcrumbPage>{fileName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
