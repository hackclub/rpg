// POST /api/attack/end
// Start or end an attack session

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma, { isCurrentlyBattling, getLatestSessionDetails, getActiveBossDetails } from "@/lib/prisma";
import { determineDamage, determineTreasure, determineExperience, determineTimeSpentPaused } from "@/lib/stats";


async function onBattleCompletion(search: { where: { email: string } }, userId: string){
    // when an attack is triggered as complete: 
    // 1. update duration of attack session and damage done in attack session
    let latestSession = (await getLatestSessionDetails(userId))
    const weaponMultiplier = latestSession?.multiplier ? latestSession?.multiplier : 1
    const totalSecondsPaused = determineTimeSpentPaused(latestSession?.timesPaused, latestSession?.timesUnpaused)
    const updateUserBattlingSession = await prisma.battle.update({
        where: {
            id: latestSession!["id"]
          },
          data: {
            duration: ((new Date()).getTime() - (new Date(latestSession!["createdAt"])).getTime())/1000 - totalSecondsPaused.reduce((pSum, a) => pSum + a, 0), // duration of attack session in seconds
            timePaused: totalSecondsPaused.reduce((pSum, a) => pSum + a, 0)
        },
        });
    // 2. update boss hp according to battle duration
    const damageDoneLatestSession = await prisma.battle.findFirst(
        {
            where: {
                id: latestSession!["id"]
            }
        })
    const currentBossData = (await getActiveBossDetails())!
    const bossTiedToAttackSession = latestSession!["boss"]["name"]
    if (currentBossData && currentBossData.name == bossTiedToAttackSession){
        if (currentBossData.health - determineDamage(damageDoneLatestSession!["duration"], weaponMultiplier) <= 0){
            const setBossDeath = await prisma.boss.updateMany({
                where: {
                    active: true
                },
                data: { 
                    health: 0,
                    userId: userId,
                    active: false
                }
            })
        } else { 
        
            const reduceBossHP = await prisma.boss.update({
                where: {
                    id: currentBossData["id"]
                },
                data: {
                    health: { decrement: determineDamage(damageDoneLatestSession!["duration"], weaponMultiplier)}
                }
            })
        }
    }

    // 3. update user's battling status + add rewards
    const setUserIsNotBattling = await prisma.user.update({
        ...search, 
        data: {
            battling: false,
            treasure: { increment: determineTreasure(damageDoneLatestSession!["duration"], weaponMultiplier)},
            experience: { increment: determineExperience(damageDoneLatestSession!["duration"], weaponMultiplier)}
        }
    })
    // 4. update damage done in the recent session
    latestSession = await getLatestSessionDetails(userId) // refresh the info we have on hand
    const updateUserDamageSession = await prisma.battle.update({
        where: {
            id: latestSession!["id"]
          },
        data: {
            damage: determineDamage(latestSession!["duration"], weaponMultiplier)
        }
    })
}


export async function POST(request: NextRequest){
    const session = await auth();
    const body = await request.json()

    if (!session){
        return NextResponse.json({error: "Unauthed", status: 401})
    }

    const search = {
        where: {
            email: session?.user.email!
        }
    }
    // End battling session

    if ((await isCurrentlyBattling(session?.user.email!))!["battling"]){
        onBattleCompletion(search, session?.user.id!)
        return NextResponse.json({message: "Session - Ended - False", status: 200}) 
    } 
}