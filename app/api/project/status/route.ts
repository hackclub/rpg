// GET api/project/status
// Return a list of all custom projects for a specific user
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(){
    const session = await auth();
    const customProjects = await prisma.project.findMany({
        where: 
            {
            userId: session?.user.id
            },
        select: {
            name: true
        }
    })
    return NextResponse.json(customProjects)
}