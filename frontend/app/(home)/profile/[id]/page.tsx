import prisma from "@/db";
import { cn } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { divide } from "lodash";

const getCurrentUserDetails = async () => {
  // console.log('get user details start');
  // const date = new Date();
  const session = await getServerSession(authOptions);
  // console.log(
  //   `get user details end ${  (new Date().getTime() - date.getTime()) / 1000}`,
  // );
  return session;
};

export async function fetchUserDetails(userName: string) {
  return new Promise<{
    id: string;
    name: string;
    email: string;
    userName: string;
    image: string | null;
    bannerImage: string | null;
  } | null>((resolve, reject) => {
    try {
      const user = prisma.user.findUnique({
        where: {
          userName,
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
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

export async function fetchUserPlaygrounds(userId: string) {
  return new Promise<
    {
      id: string;
      ownerId: string;
      name: string;
      description: string | null;
      image: string | null;
      url: string;
      created: Date;
      lastUpdated: Date;
    }[]
  >((resolve, reject) => {
    try {
      const publicPlaygrounds = prisma.playground.findMany({
        where: {
          ownerId: userId,
          private: false,
        },
        select: {
          id: true,
          ownerId: true,
          name: true,
          description: true,
          image: true,
          url: true,
          created: true,
          lastUpdated: true,
        },
      });
      resolve(publicPlaygrounds);
    } catch (error) {}
  });
}

export default async function page({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUserDetails();
  if (!currentUser) {
    return null;
  }
  const decodedId = decodeURIComponent(params.id);
  const userName = decodedId.replace(/@/g, "");
  const user = await fetchUserDetails(userName);
  if (!user) {
    return (
      <div className="grid h-full w-full place-items-center">
        <h1 className="text-2xl">User not found</h1>
      </div>
    );
  }
  const playgrounds = await fetchUserPlaygrounds(user.id);

  return (
    <div className="h-full w-full">
      <div
        className={cn(
          "flex w-full flex-col space-y-2 px-2 py-1 md:space-y-4 md:px-5 md:py-4",
        )}
      >
        <div
          className="w-full rounded-lg"
          style={{
            backgroundImage: user?.bannerImage
              ? `url(${user?.bannerImage})`
              : "url(/default-banner.webp)",
          }}
        >
          <div
            className="flex w-full p-5"
            // style={{ mask: "(black,black,transparent)" }}
          >
            <div className="flex w-fit flex-col gap-4">
              <div className="p-2">
                <Image
                  src={user?.image ?? "/placeholder.svg"}
                  alt="profile picture"
                  width={250}
                  height={250}
                  className="rounded-full"
                  priority
                />
              </div>
              <div className="flex-1">
                <div>
                  <h1 className="font-heading text-4xl font-bold">
                    {user?.name}
                  </h1>
                  <p className="font-light">{user?.email}</p>
                  <p className="font-light">{decodedId}</p>
                </div>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
        <div className="w-full flex-1 px-4">
          <div className="flex w-full items-center justify-between border-b">
            <h2 className="text-2xl font-bold">Public Playgrounds</h2>
            <div>Search</div>
          </div>
          <ul className="grid w-full grid-cols-1 flex-col divide-y">
            {playgrounds.length < 1 ? (
              <div className="flex w-full items-center justify-center">
                <h1 className="text-2xl">No public playgrounds</h1>
              </div>
            ) : (
              playgrounds.map((playground) => {
                return (
                  <Link
                    key={playground.id}
                    href={playground.url}
                    className="bg-accent-1 flex w-full items-center gap-5 rounded-lg p-2"
                    role="listitem"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={playground.image ?? "/placeholder.svg"}
                        alt="playground image"
                        width={30}
                        height={30}
                      />
                      <h3>{playground.name}</h3>
                    </div>
                    <p className="text-xs font-extralight text-muted-foreground">
                      {getLastUpdated(playground.lastUpdated)}
                    </p>
                  </Link>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getLastUpdated(lastUpdated: Date) {
  let timeElapsed = Date.now() - lastUpdated.getTime();
  let _year = timeElapsed / 31536000000;
  if (_year > 1) {
    return `${_year} years ago`;
  }
  let _month = timeElapsed / 2592000000;
  if (_month > 1) {
    return `${_month} months ago`;
  }
  let _day = timeElapsed / 86400000;
  if (_day > 1) {
    return `${_day} days ago`;
  }
  let _hour = timeElapsed / 3600000;
  if (_hour > 1) {
    return `${_hour} hours ago`;
  }
  let _minute = timeElapsed / 60000;
  if (_minute > 1) {
    return `${_minute} minutes ago`;
  }
  return "Just now";
}
