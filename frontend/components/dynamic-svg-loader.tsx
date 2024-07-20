import { LucideProps } from "lucide-react";
import React, { useEffect, useState } from "react";

// DynamicSVGComponentProps interface to define the props type
interface DynamicSVGComponentProps {
  svgPath: string; // Path to the SVG file
  svgProps?: LucideProps; // Props to pass to the SVG component
}

export const DynamicSVGComponent: React.FC<DynamicSVGComponentProps> = ({
  svgPath,
  svgProps,
}) => {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    const importSVG = async () => {
      try {
        fetch(svgPath)
          .then((response) => {
            if (response.ok) return response.text();
            else throw new Error("Failed to load SVG");
          })
          .then((svgText) => {
            console.log(svgText);
            setSvgMarkup(svgText);
          })
          .catch((error) => {
            console.error("Failed to load SVG:", error);
          });
      } catch (error) {
        console.error("Failed to load SVG:", error);
      }
    };

    importSVG();
  }, [svgPath]);

  return svgMarkup ? (
    <svg {...svgProps} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
  ) : null;
};
