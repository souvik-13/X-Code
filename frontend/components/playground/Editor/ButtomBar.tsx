import { cn } from "@/lib/utils";

interface ButtomBarProps {
  className?: string;
  language: string;
  line: number;
  column: number;
}

const ButtomBar = (params: ButtomBarProps) => {
  return (
    <div className={cn(params.className)}></div>
  )
};

export default ButtomBar;
