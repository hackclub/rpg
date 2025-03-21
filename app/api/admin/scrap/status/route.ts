import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest){
    const session = await auth();
    if (!session){
        return NextResponse.json({error: "Unauthed"}, {status: 401})
    }

    if (session.user.role !== "admin"){
        return NextResponse.json({error: "Not an admin"}, {status: 401})
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