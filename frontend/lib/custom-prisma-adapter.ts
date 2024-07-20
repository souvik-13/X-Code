/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://www.prisma.io/docs">Prisma</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://www.prisma.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/prisma.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @prisma/client @auth/prisma-adapter
 * npm install prisma --save-dev
 * ```
 *
 * @module @auth/prisma-adapter
 */
import { Account, Awaitable, User } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";

export interface ExtendedAdapterUser extends User {
  id: string;
  email: string;
  userName: string;
  url: string;
  emailVerified: Date | null;
}

export interface ExtendedAdapterAccount extends Account {
  userId: string;
}

export interface ExtendedAdapterSession {
  /** A randomly generated value that is used to get hold of the session. */
  sessionToken: string;
  /** Used to connect the session to a particular user */
  userId: string;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  expires: Date;
  token: string;
}

export interface ExtendedAdapter {
  createUser?: (
    user: Omit<ExtendedAdapterUser, "id">,
  ) => Awaitable<ExtendedAdapterUser>;
  getUser?: (id: string) => Awaitable<ExtendedAdapterUser | null>;
  getUserByEmail?: (email: string) => Awaitable<ExtendedAdapterUser | null>;
  /** Using the provider id and the id of the user for a specific account, get the user. */
  getUserByAccount?: (
    providerAccountId: Pick<
      ExtendedAdapterAccount,
      "provider" | "providerAccountId"
    >,
  ) => Awaitable<ExtendedAdapterUser | null>;
  updateUser?: (
    user: Partial<ExtendedAdapterUser> & Pick<ExtendedAdapterUser, "id">,
  ) => Awaitable<ExtendedAdapterUser>;
  /** @todo Implement */
  deleteUser?: (
    userId: string,
  ) => Promise<void> | Awaitable<ExtendedAdapterUser | null | undefined>;
  linkAccount?: (
    account: ExtendedAdapterAccount,
  ) => Promise<void> | Awaitable<ExtendedAdapterAccount | null | undefined>;
  /** @todo Implement */
  unlinkAccount?: (
    providerAccountId: Pick<
      ExtendedAdapterAccount,
      "provider" | "providerAccountId"
    >,
  ) => Promise<void> | Awaitable<ExtendedAdapterAccount | undefined>;
  /** Creates a session for the user and returns it. */
  createSession?: (session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) => Awaitable<ExtendedAdapterSession>;
  getSessionAndUser?: (sessionToken: string) => Awaitable<{
    session: ExtendedAdapterSession;
    user: ExtendedAdapterUser;
  } | null>;
  updateSession?: (
    session: Partial<ExtendedAdapterSession> &
      Pick<ExtendedAdapterSession, "sessionToken">,
  ) => Awaitable<ExtendedAdapterSession | null | undefined>;
  /**
   * Deletes a session from the database.
   * It is preferred that this method also returns the session
   * that is being deleted for logging purposes.
   */
  deleteSession?: (
    sessionToken: string,
  ) => Promise<void> | Awaitable<ExtendedAdapterSession | null | undefined>;
  createVerificationToken?: (
    verificationToken: VerificationToken,
  ) => Awaitable<VerificationToken | null | undefined>;
  /**
   * Return verification token from the database
   * and delete it so it cannot be used again.
   */
  useVerificationToken?: (params: {
    identifier: string;
    token: string;
  }) => Awaitable<VerificationToken | null>;
}

export function CustomPrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>,
): ExtendedAdapter {
  const p = prisma as PrismaClient;
  // @ts-ignore
  return {
    ...PrismaAdapter(p),
    createUser(user) {
      const userName = user.email.split("@")[0];
      const name = user.name ?? userName;
      return p.user.create({
        data: { ...user, name, userName, url: `/@${userName}` },
      });
    },
    getUser: (id: string): Awaitable<ExtendedAdapterUser | null> => {
      return p.user.findUnique({ where: { id } });
    },
  };
}
