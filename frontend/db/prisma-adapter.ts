import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export default function CustomPrismaAdapter(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) {
    const adapter = PrismaAdapter(prisma);

    adapter.createUser = async (data) => {
        const { name, email, ...otherData } = data; // Destructure data

        // Check for existing user (optional)
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            // Handle existing user case if needed
            return existingUser;
        }

        // Create a new user with the updated fields
        return prisma.user.create({
            data: {
                email,
                fullName: name, // Rename name to fullName
                userName: data.userName || `<span class="math-inline">\{email\.split\('@'\)\[0\]\}\_</span>{Math.random().toString(36).substring(7)}`, // Generate default username if not provided
                ...otherData,
            },
        });
    };

    return adapter;
}