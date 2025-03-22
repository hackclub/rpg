// POST /admin/scrap/create
// Manually create or update a scrap for a user. For those times when the website bugs out.
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { verifyAuth } from "@/lib/person";

export async function POST(request: NextRequest){
    const session = await auth();
    const invalidSession = await verifyAuth({verifyAdmin: true})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const body = await request.json()
    const scrapId = body["scrapId"]
    const dataTo = {
        battleId: body["battleId"],
        description: body["description"],
        codeUrl: body["codeUrl"]!,
        projectId: body["projectId"],
        url: body["url"],
        userId: body["userId"]
    }

    console.log(dataTo)
    if (!scrapId){
        const createScrap = await prisma.scrap.create({
            data: dataTo
        })
        return NextResponse.json({message: "Scrap created"}, { status: 200 })
    } else {
        const updateScrap = await prisma.scrap.update({
            where: {
                id: scrapId,
            },
            data: dataTo
        })
        return NextResponse.json({message: "Scrap updated"}, { status: 200 })
    }


}