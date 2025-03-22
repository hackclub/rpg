// POST /api/battle/start 
// start a battle
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getActiveBossDetails } from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";

export async function POST(request: NextRequest){
    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const body = await request.json()

    const search = {
        where: {
            email: session?.user.email!
        }
    }
    const projectName = body["projectName"] 
    const effect = body["effect"]

    // fetch the equipped weapon from server 
    const getCurrentEquippedWeapon = (await prisma.item.findMany({
        where: {
            user:  {
                email: session?.user.email!
                },
            userEquipped: true
            }
        }))[0]

        let multiplier

        if (!getCurrentEquippedWeapon){
            multiplier = 1
        } else {
            multiplier = getCurrentEquippedWeapon["multiplier"]
        }

        if (effect == "weakness"){
            multiplier *= 2

        } else if (effect == "strength"){
            multiplier /= 2
        } else {
            
        }
    // idfk get the project id from name 
    const actualProjectId = await prisma.project.findFirst({
        where: {
                userId: session?.user.id,
                name: projectName
            }
    })
    console.log(session?.user.id, (await getActiveBossDetails())!["id"],actualProjectId!["id"], effect)
    const res = await prisma.battle.create({
        data: {
            userId: session?.user.id!,
            bossId: (await getActiveBossDetails())!["id"],
            projectId: actualProjectId!["id"],
            effect: effect,
            multiplier: multiplier
        }
    })
    const setUserIsCurrentlyBattling = await prisma.user.update({
        ...search,
        data: {
            battling: true
        }
    })
    return NextResponse.json({message: "Session - Created - True", status: "200"})
}
