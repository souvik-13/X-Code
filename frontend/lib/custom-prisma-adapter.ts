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
import type { PrismaClient, Prisma } from "@prisma/client"
import type {
    Adapter,
    AdapterAccount,
    AdapterSession,
    AdapterUser,
} from "@auth/core/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"

export function CustomPrismaAdapter(
    prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>
): Adapter {
    const p = prisma as PrismaClient
    return {
        ...PrismaAdapter(p),
        createUser(user) {
            const userName = user.email.split("@")[0]
            // const name = user.name ?? `user-${user.id}`
            const name = user.name ?? userName
            return p.user.create({
                data: { ...user, name, userName, url: `/profile/@${userName}` },
            })
        },

    }
}
