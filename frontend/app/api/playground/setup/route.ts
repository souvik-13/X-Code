import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import awsService from "@/lib/aws";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

type ResponseData = {
  message: string;
  error: any;
  data: any;
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

async function createProject(
  projectId: string,
  framework: string,
): Promise<{
  success: boolean;
  message: string;
  error?: any;
  destFolderPrefix?: string;
}> {
  try {
    const destFolderPrefix = `playgrounds/${projectId}`;
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
    return {
      success: false,
      message: "Error creating project",
      error,
    };
  }
}

async function createPlaygroundForUser(
  userId: string,
  playgroundData: {
    name: string;
    description?: string;
    image?: string;
    url: string;
    private: boolean;
  },
) {
  try {
    const newPlayground = await prisma.playground.create({
      data: {
        ...playgroundData,
        owner: {
          connect: { id: userId },
        },
        accessList: {
          create: {
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });

    console.log("Playground created:", newPlayground);
    return newPlayground;
  } catch (error) {
    console.error("Error creating playground for user:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const { projectName, framework, description, privacy } = await req.json();
  const session = await getServerSession(authOptions);
  /**
   *  user: {
    name: 'Souvik Karmakar',
    email: 'souvikk431@gmail.com',
    image: 'https://avatars.githubusercontent.com/u/117534993?v=4',
    id: 'cly32cv7w000013cz7vn68kr8',
    userName: 'souvikk431',
    url: '/@souvikk431'
  },
   */

  let message = "";
  let data: any;
  let error: any;
  let errCode: number = 500;

  try {
    if (!session) {
      errCode = 401;
      message = "Session not found";
      return Response.json({ message }, { status: errCode });
    }

    const newPlaygroundData = {
      name: projectName,
      description,
      private: privacy,
      // @ts-ignore
      url: `${session.user?.url}/${projectName}`,
    };

    const project = await createPlaygroundForUser(
      // @ts-ignore
      session.user.id,
      newPlaygroundData,
    );

    // copy template to user's folder
    const projectCreation = await createProject(project.id, framework);

    if (projectCreation.success) {
      data = {
        ...projectCreation,
      };
      message = "Playground created successfully";
      errCode = 201;
    } else {
      message = projectCreation.message;
      errCode = 500;

      // delete playground if project creation failed
      prisma.playground.delete({
        where: { id: project.id },
      });
    }
  } catch (error) {
    console.error("Error creating playground", error);
    message = "Error creating playground";
    errCode = 500;
  } finally {
    return NextResponse.json({ message, error, data }, { status: errCode });
  }
}
