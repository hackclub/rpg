import NextAuth, { NextAuthConfig } from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma, { setUserDefaultInventory } from "@/lib/prisma"
import { getPersonData } from "./lib/person"

export const config: NextAuthConfig = {
  theme: {
    logo: "",
  },
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    SlackProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      checks: ['pkce', 'nonce'],
    }),
  ],
  events: {
    async signIn({user, account, profile, isNewUser}) {
      const people = await getPersonData(user.email!) as any
      const r = await prisma.user.update({
         where: {
           id: user.id!
         },
         data: {
           nickname: people["display_name"] ? people["display_name"] : people["real_name"] ,
         }
      })

      if (isNewUser){
        setUserDefaultInventory(user.id!)
        // manually assign slack id because no jwt
         await prisma.user.update({
           where: {
             id: user.id!
           },
           data: {
             providerAccountId: profile?.sub!,
           }
         })
      }
    }
  },
  callbacks: {
    async session({session, token, user, trigger}) {  
      return { ...session, providerAccountId: user.providerAccountId }
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)