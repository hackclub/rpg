import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest){
    const session = await auth();
    const body = await request.json()
    if (!session){
        return NextResponse.json({error: "Unauthed"}, {status: 401})
    }

    if (session.user.role !== "admin"){
        return NextResponse.json({error: "Not an admin"}, {status: 401})
    }

    const query = request.nextUrl.searchParams.get("query")
    if (query === "approve"){
        const r = await prisma.scrap.update({
            where: {
                id: body["id"]
            },
            data: {
                status: "approved"
            }
        })
        return NextResponse.json({message: "Session approved"}, {status: 200})
    } else if (query === "reject"){
        await prisma.scrap.update({
            where: {
                id: body["id"]
            },
            data: {
                status: "rejected"
            }
        })
        return NextResponse.json({message: "Session rejected"}, {status: 200})
    } else {
        return NextResponse.json({error: "Provide an action"}, {status: 400})
    }
}