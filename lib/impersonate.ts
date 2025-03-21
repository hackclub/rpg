'use server'
import { auth } from "@/auth";
import prisma from "./prisma";

export async function impersonate(slackId: string){
    const session = await auth();
    if (process.env.NODE_ENV !== 'development' || session?.user.role !== "admin") {
        return
      }
      
      const findSession = await prisma.session.findFirst({
        where: {
            userId: session?.user.id
        },
         select: {
            sessionToken: true
         }
      })

      const findImpersonateSession = await prisma.user.findFirst({
        where: {
            providerAccountId: slackId
        },
      })

      const r = await prisma.session.update({
            where: { 
                sessionToken: findSession!["sessionToken"]
            }, 
            data: { 
                userId: findImpersonateSession!["id"]
            },
        });
    }