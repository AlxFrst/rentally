import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import prisma from "./db"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)