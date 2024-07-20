import { AuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email"

import prisma from "@/db";
import { CustomPrismaAdapter } from "@/lib/custom-prisma-adapter";
import { Adapter } from "next-auth/adapters";

const prismaAdapter = CustomPrismaAdapter(prisma) as Adapter;

export const authOptions: AuthOptions = {
  adapter: prismaAdapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET ?? "sectr3t",
  session: { strategy: "jwt" as SessionStrategy },
  // session: {
  //     strategy: "jwt",
  //     maxAge: 30 * 24 * 60 * 60,
  //     updateAge: 24 * 60 * 60,
  // },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("user", user);
      // console.log("account", account);
      // console.log("profile", profile);
      // console.log("email", email);
      // console.log("credentials", credentials);
      return true; // Allow sign-in for other providers (optional)
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, user, profile }) {
      token.accessToken = account?.accessToken;
      return token;
    },
    async session({ session, token }) {
      const user = await fetchUser(token.sub as string);

      console.log(token);

      if (token && user) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub as string;
        // @ts-ignore
        session.user.userName = user?.userName;
        // @ts-ignore
        session.user.url = user?.url;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    signOut: "/auth/signout",
  },
};

async function fetchUser(userId: string) {
  if (!prismaAdapter.getUser) {
    throw new Error("getUser method is not defined on prismaAdapter");
  }

  try {
    const user = await prismaAdapter.getUser(userId);
    if (user) {
      return user;
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
