import NextAuth, { NextAuthConfig } from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
    async jwt({token, account, profile}) {
      if (account) {
        token = Object.assign({}, token, { access_token: String(account.access_token), slack_id: profile!.sub });
      }
      return token
    },
    async session({session, token, user}) {
    if(session) {
      session = Object.assign({}, { ...session }, {access_token: String(token.access_token), slack_id: token.slack_id})
    }    
    return { ...session }
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)