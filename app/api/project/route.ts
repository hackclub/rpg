// POST api/project
// Add a new project
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/person";
export async function POST(request: NextRequest){
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const session = await auth();
    const body = await request.json()
    if (!session){
        return NextResponse.json({error: "Unauthed", status: 401})
    }

    const checkIfProjectExists = await prisma.project.findFirst({
        where: {
            userId: session.user.id!,
            name: body["name"]
        }
    })
    
    if (!checkIfProjectExists){ 
        const addNewProject = await prisma.project.create({
                data: { 
                    userId: session.user.id!,
                    name: body["name"],
                    type: body["projectType"]
                }
            })
        }

    return NextResponse.json({message: "Project updated", status: 200})
}