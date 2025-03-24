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


    for (let projectIndex = 0; projectIndex < customProjects.length; projectIndex++ ){
        let duration = 0
        for (let battleIndex = 0; battleIndex < customProjects[projectIndex].battle.length; battleIndex++){
            duration += customProjects[projectIndex]["battle"][battleIndex]!.duration
        }
        delete(customProjects[projectIndex]["battle"])
        customProjects[projectIndex]["duration"] = duration
    }
    const hackatimeProjects = await fetch(`https://hackatime.hackclub.com/api/v1/users/${session?.user.providerAccountId}/stats?features=projects`)
    if (hackatimeProjects.ok){
        const projects = (await hackatimeProjects.json())["data"]["projects"] as any
        const hackatimeEdited = projects.map(({name, duration}: {name: string, duration: number}) => 
                ({ 
                    name: name + " [Hackatime]",
                    duration: undefined // there might already be hackatime data for this project, in which case we only want to get the time we know for sure (as in the ones tracked on rpg)
                })
            )
        const initJoined = customProjects.concat(hackatimeEdited)
        return NextResponse.json(initJoined)

    } else {
        return NextResponse.json(customProjects)
    }
}