import { NextRequest, NextResponse } from "next/server";
import awsService from "@/lib/aws";
// import { createProject } from "../../../../lib/create-project";

type ResponseData = {
  message: string;
};

const frameworkTemplates: Map<string, string> = new Map([
  ["react", "vite-react"],
  ["next.js", "nextjs-base"],
  ["express", "express-base"],
  ["node.js", "node-base"],
  ["python", "python-base"],
  ["rust", "rust-base"],
  ["cpp", "cpp-base"],
]);

async function createProject(projectName: string, framework: string) {
  try {
    const destFolderPrefix = `playgrounds/${projectName}`;
    if (framework === "empty") {
      await awsService.createFolder(destFolderPrefix);
    } else {
      const templateFolder = frameworkTemplates.get(framework);
      if (!templateFolder) {
        throw new Error("Invalid framework");
      }
      await awsService.copyFolder(
        `templates/${templateFolder}`,
        destFolderPrefix,
      );
    }
    return {
      success: true,
      message: "Project created successfully at ",
      destFolderPrefix,
    };
  } catch (error) {
    console.error("Error creating project", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const { projectName, templateName, framework } = await req.json();
  let message = "";

  await createProject(projectName, framework)
    .then((data) => {
      message = "Project created successfully at " + data.destFolderPrefix;
    })
    .catch((error) => {
      message = "Error creating project";
    })
    .finally(() => {
      console.log("Project creation completed");
    });

  return NextResponse.json({ message });
}
