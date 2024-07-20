import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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

const fetchPlaygrounds = async (userId: string) => {
  return new Promise<
    | {
        id: string;
        ownerId: string;
        name: string;
        description: string | null;
        image: string | null;
        url: string;
        private: boolean;
        created: Date;
        lastUpdated: Date;
      }[]
    | null
  >((resolve, reject) => {
    try {
      const playgrounds = prisma.playground.findMany({
        where: {
          ownerId: userId,
        },
      });
      resolve(playgrounds);
    } catch (error) {
      reject(error);
    }
  });
};

const page = async () => {
  const session = await getUserDetails();
  // @ts-ignore
  const playgrounds = await fetchPlaygrounds(session?.user?.id);
  return <div>{JSON.stringify(playgrounds)}</div>;
};

export default page;
