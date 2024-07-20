import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: unknown;
    user: {
      /** The user's postal address. */
      id: string;
      userName: string;
      url: string;
    } & DefaultSession["user"];
  }

  interface AdapterUser {
    id: string;
    email: string;
    userName: string;
    url: string;
    emailVerified: Date | null;
  }
}

