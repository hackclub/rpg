// GET /public/[slackID]
// Retrieve public stats from about a user based on their slack ID
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { determineLevel } from "@/lib/stats";

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
    })
    console.log(data)
    return NextResponse.json(data)
}