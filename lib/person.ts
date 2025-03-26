import { User } from "@prisma/client"
import prisma from "./prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function getPersonData(email: string){
    const data = await fetch(`https://slack.com/api/users.lookupByEmail?email=${email}`,
        { 
            method: "POST",
            headers: {
                Authorization: "Bearer " + process.env.SLACK_API_TOKEN
            }
        }
    ).then(r=>r.json())
    let display_name = "User"
    let real_name = "User"
    try {
        display_name = data["user"]["profile"]["display_name_normalized"]
        real_name = data["user"]["profile"]["real_name"]
    } catch {
        // progress
    }
    return { display_name, real_name }
}

async function migrateData(){
    const people = await prisma.user.findMany({
        where: {
            NOT: {
                email: "example@mail.com"
            }
        },
        select: {
            email: true,
            id: true
        }
    })
    for (let person = 0; person < people.length; person++){
        const { display_name, real_name} = await getPersonData(((people as any)[person])["email"])
        await new Promise(r => setTimeout(r, 3000));
        const r = await prisma.user.update({
            where: {
              id: (people as any)[person].id
           },
            data: {
              nickname: display_name ? display_name: real_name
            }
        })
    }

}

async function fetchBrokenSession(){
    // If people are not set as battling, but have battles that have recorded durations of 0 seconds...
    const people = await prisma.user.findMany({
        where: {
            battling: false,
            battles: {
                some: {
                    duration: {
                        equals: 0
                    }
                }
            }
        }, 
        select: {
            name: true,
            id: true,
            providerAccountId: true,
            battling: true,
            battles: {
                where: {
                    duration: {
                        equals: 0
                    }
                }
            }
        }
    })
    return people
}

async function fetchDuplicateSessions(){
    // wip - people who have more than one 0-second session
    const people = await prisma.user.findMany({
        where: {
            battles: {
                some: {
                    duration: {
                        equals: 0
                    }
                }
            }
        },
        select: {
            name: true,
            providerAccountId: true,
            battles: true
        }
    })
    return people
}

async function getTotalHours(){
    const validSession = (await prisma.battle.findMany({
        where:
            {
                duration: {
                    lte: 18000
                }
            },
        select: {
            duration: true
        }
    }))
    return (validSession).reduce((total, battle) => total + battle.duration, 0)/3600;
}

export async function verifyAuth({verifyAdmin = false, verifyBlacklist=true}: {verifyAdmin?: boolean, verifyBlacklist?: boolean}={}){
    const session = await auth()
    if (!session){
        return {error: "Unauthed"}
    }

   if (verifyBlacklist && session.user.blacklisted){
        return {error: "You have been blacklisted."}
    }

    if (verifyAdmin && session.user.role !== "admin"){
        return { error: "Not an admin." }
    }

}