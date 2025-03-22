// PUT /api/battle/cancel
// Cancel a currently running battle
import { NextResponse } from "next/server";
import { isCurrentlyBattling } from "@/lib/prisma";
import { getLatestSessionDetails } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { verifyAuth } from "@/lib/person";

export async function PUT(){
    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const currently = (await isCurrentlyBattling(session?.user.email!))!
    if (!currently["battling"]){
        return NextResponse.json({error: "Can't cancel a battle if you're not in one", status: 400})
    }
    
    const currentBattle = (await getLatestSessionDetails(session?.user.id!))!

    const deleteBattle = await prisma.battle.delete({
        where: {
            id: currentBattle["id"],
            duration: 0
        }
    })
    
    await prisma.user.update({
        where: {
            id: session?.user.id
        },
        data: {
            battling: false
        }
    })

    return NextResponse.json({message: "Session deleted", status: 200})
}
