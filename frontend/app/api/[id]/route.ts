import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  let uesrData: any = null;
  let status: number = 500;
  let error: any = null;

  try {
    if (!session?.user) {
      status = 401;
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        userName: params.id.split("@")[1],
      },
      select: {
        id: true,
        name: true,
        email: true,
        userName: true,
        image: true,
        bannerImage: true,
      },
    });
    if (!user) {
      status = 404;
      throw new Error("User not found");
    }

    uesrData = user;
    status = 200;
  } catch (error) {
    console.error("Error fetching user data", error);
    error = error;
  } finally {
    return NextResponse.json({ status, error, data: uesrData });
  }
}
