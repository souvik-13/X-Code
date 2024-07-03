import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { BeforeBooting } from "./beforeBooting";

const getCurrentUserDetails = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

const getPlaygroundDetails = async () : Promise<{}> => {
  return new Promise((resolve, reject) => {});
}

export default async function Page({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const currentUser = await getCurrentUserDetails();
  const decodedId = decodeURIComponent(params.id);
  return <Suspense fallback={<BeforeBooting />}></Suspense>;
}
