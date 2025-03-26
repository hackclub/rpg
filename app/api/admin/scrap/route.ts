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
        // get the amount of treasure from the battle the scrap is associated with 
        const getBattleTreasure = (await prisma.battle.findFirst({
            where: {
                id: body["battleId"]
            },
            select: {
                user: {
                    select: {
                        id: true
                    }
                },
                treasure: true,
                scrap: true
            }
        }))!

        if (getBattleTreasure.scrap[0].status === "approved" || getBattleTreasure.scrap[0].status === "rejected" ){
            return NextResponse.json({message: "Reset before changing the status"}, {status: 400})
        }
        const approvedTreasure = getBattleTreasure.treasure

        const updateScrapStatus = await prisma.scrap.update({
            where: {
                id: body["id"]
            },
            data: {
                status: "approved"
            }
        })

        const updateVerifiedTreasure = await prisma.battle.update({
            where: {
                id: body["battleId"]
            },
            data: {
                verifiedTreasure: approvedTreasure
            }
        })
        
        const updateUserVerifiedTreasure = await prisma.user.update({
            where: {
                id: getBattleTreasure.user.id
            },
            data: {
                verifiedTreasure: {
                    increment: approvedTreasure
                }
            }
        })

        return NextResponse.json({message: "Session approved"}, {status: 200})
    } else if (query === "reject"){
        const getBattleTreasure = (await prisma.battle.findFirst({
            where: {
                id: body["battleId"]
            },
            select: {
                user: {
                    select: {
                        id: true
                    }
                },
                treasure: true,
                scrap: true
            }
        }))!

        if (getBattleTreasure.scrap[0].status === "approved" || getBattleTreasure.scrap[0].status === "rejected" ){
            return NextResponse.json({message: "Reset before changing the status"}, {status: 400})
        }
        
        await prisma.scrap.update({
            where: {
                id: body["id"]
            },
            data: {
                status: "rejected"
            }
        })
        return NextResponse.json({message: "Session rejected"}, {status: 200})
    } else if (query === "reset")  {
        // get the amount of treasure from the battle previously 
        const getBattleTreasure = (await prisma.battle.findFirst({
            where: {
                id: body["battleId"]
            },
            select: {
                user: {
                    select: {
                        id: true
                    }
                },
                verifiedTreasure: true
            }
        }))!
        const prevApprovedTreasure = getBattleTreasure.verifiedTreasure

        const updateScrapStatus = await prisma.scrap.update({
            where: {
                id: body["id"]
            },
            data: {
                status: "unreviewed"
            }
        })

        const updateVerifiedTreasure = await prisma.battle.update({
            where: {
                id: body["id"]
            },
            data: {
                verifiedTreasure: 0
            }
        })

        const updateUserVerifiedTreasure = await prisma.user.update({
            where: {
                id: getBattleTreasure.user.id
            },
            data: {
                verifiedTreasure: {
                    decrement: prevApprovedTreasure
                }
            }
        })
    return NextResponse.json({message: "Session reset"}, { status: 200 })

    } else {
        return NextResponse.json({error: "Provide an action"}, {status: 400})
    }
}