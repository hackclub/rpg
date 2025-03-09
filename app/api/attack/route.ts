// POST /api/attack
// Start or end an attack session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isCurrentlyAttacking, getLatestSessionDetails } from "@/lib/prisma";

export async function POST(request: NextRequest){
    const projectId = (await request.json())["projectId"]
    const session = await auth();

    const search = {
        where: {
            email: session?.user.email!
        }
    }
    if ((await isCurrentlyAttacking(session?.user.email!))!["attacking"]){
        const setUserIsNotAttacking = await prisma.user.update({
            ...search, 
            data: {
                attacking: false
            }
        })
        const latestSession = await getLatestSessionDetails(session?.user.id!)
        const updateUserAttackingSession = await prisma.attack.update({
            where: {
                id: latestSession!["id"]
              },
              data: {
                duration: ((new Date()).getTime() - (new Date(latestSession!["createdAt"])).getTime())/1000 // duration of attack session in seconds
              },
            });
        return NextResponse.json({message: "Session - Ended - False", status: 200}) 

    } else {
        const res = await prisma.attack.create({
            data: {
                userId: session?.user.id!,
                projectId: projectId
            }
        })
        const setUserIsCurrentlyAttacking = await prisma.user.update({
            ...search,
            data: {
                attacking: true
            }
        })
        return NextResponse.json({message: "Session - Created - True", status: "200"})
    }
}