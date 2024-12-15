import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismma from "@lib/db"

// Providers
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
})