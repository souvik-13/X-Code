"use server";
import Landing from "@/views/Landing";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const getUserDetails = async () => {
  // console.log('get user details start');
  // const date = new Date();
  const session = await getServerSession(authOptions);
  // console.log(
  //   `get user details end ${  (new Date().getTime() - date.getTime()) / 1000}`,
  // );  
  return session;
};

export default async function Home() {
  const session = await getUserDetails();
  if (session) {
    redirect("/~");
  }
  return <Landing />;
}
