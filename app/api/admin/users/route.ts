// GET /api/admin/users
// get all users
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma";

export async function GET(){
    const session = await auth(); 

    if (!session){
        return NextResponse.json({error: "Unauthed"}, {status: 401})
    }

    if (session?.user.role !== "admin"){
        return NextResponse.json({error: "Not an admin."}, {status: 400})
    } 

    const response = await prisma.user.findMany({
        select: {
            name: true,
            nickname: true,
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