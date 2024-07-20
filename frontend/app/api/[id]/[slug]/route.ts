import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; slug: string } },
) {
  const session = await getServerSession(authOptions);
  let playgroundData: any = null;
  let status: number = 500;
  let error: any = null;

  try {
    if (!session?.user) {
      status = 401;
      throw new Error("Unauthorized");
    }

    let data = await prisma.user.findUnique({
      where: {
        userName: params.id.split("@")[1],
      },
      include: {
        Playgrounds: {
          where: {
            name: params.slug,
          },
        },
      },
    });
  } catch (error) {
  } finally {
    return NextResponse.json({ params });
  }
}
