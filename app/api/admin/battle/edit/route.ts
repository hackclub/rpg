// POST /api/admin/battle/edit
// edit a battle's length and update all associated info w/ the battle length like the experience gained, treasure earned etc.

import { auth } from "@/auth";
import { verifyAuth } from "@/lib/person";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { determineExperience, determineTreasure, determineDamage } from "@/lib/stats";

export async function POST(request: NextRequest){
    const session = await auth();
    const body = await request.json()
    const battleId = body["battleId"]
    const duration = Number(body["duration"])
    
    const invalidSession = await verifyAuth({verifyAdmin: true})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }

    const prevBattleData = await prisma.battle.findFirst({
        where: {
            id: battleId
        },
        select: {
            multiplier: true,
            damage: true,
            duration: true,
            user: {
                select: {
                    id: true
                }
            }
        }
    })

    const updateBattle = await prisma.battle.update({
        where: {
            id: battleId
        },
        data: {
            duration: duration,
            damage: determineDamage(duration, prevBattleData!["multiplier"])
        }
    })
    console.log(updateBattle)

    const updateUserRewards = await prisma.user.update({
        where: {
            id: prevBattleData?.user.id
        },
        data: {
            treasure: {
                decrement: determineTreasure(prevBattleData!["duration"], prevBattleData!["multiplier"]) - determineTreasure(duration, prevBattleData!["multiplier"])
            },
            experience: {
                decrement: determineExperience(prevBattleData!["duration"], prevBattleData!["multiplier"]) - determineExperience(duration, prevBattleData!["multiplier"])
            }
        }
    })
    console.log(updateUserRewards)
    return NextResponse.json({ message: "Battle updated successfully" }, { status: 200 })


}