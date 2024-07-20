import Sidebar from "@/app/(home)/components/sidebar";
import Topbar from "@/app/(home)/components/topbar";

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
  // console.log(session);
  return session;
};

export default async function HomePageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getUserDetails();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    session && (
      <main className="relative h-screen w-screen overflow-hidden">
        <Topbar className="h-topbar absolute left-0 right-0 top-0 border" />
        <div className="absolute bottom-0 left-0 right-0 top-10 flex">
          <Sidebar className="h-full max-w-56 " />
          <div className="flex-1">
            <div className="relative overflow-hidden">
              {/* push notification */}
              {children}
            </div>
          </div>
        </div>
      </main>
    )
  );
}
