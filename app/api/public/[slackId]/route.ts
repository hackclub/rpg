// GET /public/[slackID]
// Retrieve public stats from about a user based on their slack ID
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { determineLevel } from "@/lib/stats";

type returnedData = {
    treasure: number,
    experience: number,
    level?: number,
    timeInBattle: number,
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slackId: string }> }){
    const id = (await params).slackId
    const data = await prisma.user.findFirst({
        where: {
            providerAccountId: id
        },
        select: {
            treasure: true,
            experience: true
        }
    }) as returnedData

    const timeInBattle = await prisma.battle.findMany({
        where: {
            user: {
                providerAccountId: id
            }
        },
        select: {
            duration: true
        }
    })

    if (data && timeInBattle){
        data["level"] = determineLevel(data["experience"])
        data["timeInBattle"] = timeInBattle.reduce((partialSum, a) => partialSum + a.duration, 0)
    }
    return NextResponse.json(data)
}