import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";

export async function GET(request: NextRequest){
    const session = await auth();
    const invalidSession = await verifyAuth({verifyAdmin: true})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const scrapId = Number(request.nextUrl.searchParams.get("id"))
    const response = await prisma.scrap.findFirst({
        where: {
            id: scrapId!
        },
        include: {
            battle: true
        }
    })

    return NextResponse.json(response)
}