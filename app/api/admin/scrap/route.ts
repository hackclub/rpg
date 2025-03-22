import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { verifyAuth } from "@/lib/person";
export async function POST(request: NextRequest){
    const session = await auth();
    const invalidSession = await verifyAuth({verifyAdmin: true})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const body = await request.json()

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