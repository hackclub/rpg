// GET api/project/status
// Return a list of all custom projects for a specific user
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAuth } from "@/lib/person";

export async function GET(){
    const session = await auth();
    const invalidSession = await verifyAuth()
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    const customProjects = await prisma.project.findMany({
        where: 
            {
            userId: session?.user.id
            },
        select: {
            name: true,
            battle: {
                select: {
                    duration: true
                }
            }
        }
    }) as any
    const r = customProjects
    for (var projectIndex = 0; projectIndex < customProjects.length; projectIndex++ ){
        let duration = 0
        for (var battleIndex = 0; battleIndex < customProjects[projectIndex].battle.length; battleIndex++){
            duration += customProjects[projectIndex]["battle"][battleIndex]!.duration
        }
        delete(r[projectIndex]["battle"])
        r[projectIndex]["duration"] = duration
    }
    return NextResponse.json(r)

}