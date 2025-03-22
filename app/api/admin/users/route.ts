// GET /api/admin/users
// get all users
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";

export async function GET(){
    const session = await auth(); 
    const invalidSession = await verifyAuth({verifyAdmin: true})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const response = await prisma.user.findMany({
        select: {
            name: true,
            nickname: true,
            providerAccountId: true,
            id: true,
            image: true,
            scraps: true,
            projects: {
                include: {
                    battle: {
                        include: {
                            scrap: true,
                        }
                    }
                } 
            },
            treasure: true,
            experience: true,
        }
    })
    return NextResponse.json({message: response}, {status: 200})
}