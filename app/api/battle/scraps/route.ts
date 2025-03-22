import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getLatestSessionDetails } from "@/lib/prisma";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";

export async function POST(request: NextRequest){

    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const body = await request.json()
    const url = body["url"]
    const description = body["description"]

    const mostRecentBattle = (await getLatestSessionDetails(session!.user.id!))!

    const createScrap = await prisma.scrap.create({
        data: {
            battleId: mostRecentBattle.id, 
            projectId: mostRecentBattle.project.id,
            userId: session!.user.id!,
            description: description,
            url: url
        }
    })

    return NextResponse.json({message: "Scrap created", status: 200})

}