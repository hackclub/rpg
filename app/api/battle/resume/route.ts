// PUT /api/battle/resume
// Resume an already paused battle

import { NextResponse, NextRequest } from "next/server";
import { isCurrentlyBattling, getLatestSessionDetails } from "@/lib/prisma";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";

export async function PUT(){
    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const inBattle = (await isCurrentlyBattling(session?.user.email!))!
    if (!inBattle["battling"]){
        return NextResponse.json({error: "Cannot unpause; user is not in a battle", status: 400})
    }
    if (!inBattle["paused"]){
        return NextResponse.json({error: "Cannot unpause; user is already unpaused", status: 400})
    }

    const latestSession = (await getLatestSessionDetails(session?.user.id!))!
    const updateLatestSession = await prisma.battle.update({
        where: {
            id: latestSession.id
        },
        data: {
            timesUnpaused: {
                push: new Date(Date.now())
            }
        }
    })
    const setStatusPaused = await prisma.user.update({
        where: {
            id: session?.user.id
        },
        data: {
            paused: false
        }
    })
    return NextResponse.json({message: "Session resumed", status: 200})

}