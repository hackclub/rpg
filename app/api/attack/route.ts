// POST /api/attack
// Start or end an attack session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma, { isCurrentlyAttacking, getLatestSessionDetails, getActiveBossDetails } from "@/lib/prisma";

async function onAttackCompletion(search: { where: { email: string } }, userId: string){
    // when an attack is triggered as complete: 
    // 1. update duration of attack session 
    const latestSession = await getLatestSessionDetails(userId)
    const updateUserAttackingSession = await prisma.attack.update({
        where: {
            id: latestSession!["id"]
          },
          data: {
            duration: ((new Date()).getTime() - (new Date(latestSession!["createdAt"])).getTime())/1000 // duration of attack session in seconds
          },
        });
        
    // 2. update boss hp according to attack session duration
    const damageDoneLatestSession = await prisma.attack.findFirst(
        {
            where: {
                id: latestSession!["id"]
            }
        })
    const reduceBossHP = await prisma.boss.update({
        where: {
            id: (await getActiveBossDetails())!["id"]
        },
        data: {
            health: {decrement: Math.ceil(damageDoneLatestSession!["duration"]/60)}
        }
    })
    // 3. update user's attacking status + add rewards
    const setUserIsNotAttacking = await prisma.user.update({
        ...search, 
        data: {
            attacking: false,
            treasure: { increment: Number((damageDoneLatestSession!["duration"]/6 * 10).toFixed(0))},
            experience: { increment: Number((damageDoneLatestSession!["duration"] * 10).toFixed(0))}
        }
    })
}




export async function POST(request: NextRequest){
    const projectId = (await request.json())["projectId"]
    const session = await auth();

    const search = {
        where: {
            email: session?.user.email!
        }
    }
    // End attacking session
    if ((await isCurrentlyAttacking(session?.user.email!))!["attacking"]){
        onAttackCompletion(search, session?.user.id!)
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