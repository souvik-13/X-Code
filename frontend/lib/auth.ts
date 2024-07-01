import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email"

import prisma from "@/db";
import { CustomPrismaAdapter } from "@/lib/custom-prisma-adapter";


export const authOptions: AuthOptions = {
    adapter: CustomPrismaAdapter(prisma) as Adapter,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? ""
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
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

            console.log("user", user)
            console.log("account", account)
            console.log("profile", profile)
            console.log("email", email)
            console.log("credentials", credentials)
            return true; // Allow sign-in for other providers (optional)
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async jwt({ token }: any) {
            return token;
        },
        async session({ session, token }: any) {
            const user = await prisma.user.findUnique({
                where: {
                    id: token.sub,
                },
            });
            if (token) {
                session.accessToken = token.accessToken;
                session.user.id = token.sub;
                session.user.userName = user?.userName;
                session.user.url = user?.url;
            }
            return session;
        },

    },
    // events: {
    //     createUser: async (message) => {
    //         console.log("createUser", message)
    //     },
    //     signIn: async (message) => {
    //         console.log("signIn", message)
    //     },
    //     signOut: async (message) => {
    //         console.log("signOut", message)
    //     },
    //     updateUser: async (message) => {
    //         console.log("updateUser", message)
    //     },

    // },
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/signup',
        signOut: '/auth/signout',


    }
}