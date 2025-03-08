import NextAuth, { NextAuthConfig } from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const config: NextAuthConfig = {
  theme: {
    logo: "",
  },
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
      checks: ['nonce'],
    }),
  ],
  callbacks: {
    async session({session, token, user}) {
    return { ...session }
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)