import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;
  console.log("currentUser", currentUser);
  console.log("params", params);

  if (!currentUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let message = "Hi there!";
  let data: any = null;
  let error: any = null;
  let status: number = 200;
  try {
    // playground id


    // console.log("currentUser", currentUser);
    // Fetch data from the database
    // data = await awsService.fetchDirectory(`playgrounds/${params.slug}`);
  } catch (error) {
    console.error("Error fetching data", error);
    message = "Error fetching data";
    error = error;
  } finally {
    return NextResponse.json({ message, data, error }, { status });
  }
}
