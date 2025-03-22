// GET /api/inventory/status
// returns inventory items
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/person";
export async function GET(request: NextRequest){
    const session = await auth();
    const query = request.nextUrl.searchParams.get("query")
    const invalidSession = await verifyAuth({verifyBlacklist: false})
    if (invalidSession){
        return NextResponse.json(invalidSession, {status: 401})
    }
    if (!query || query === "all"){
        const items = await prisma.user.findFirst({
            where: {
                email: {
                    equals: session?.user.email!
                }
            },
            select: {
                inventory: {
                    orderBy: {
                            id: "asc"
                        }
                }
            }
        })
        return NextResponse.json(items)

    } else if (query === "equipped"){
        const items = (await prisma.item.findMany({
            where: {
                user:  {
                    email: session?.user.email!
                    },
                userEquipped: true
                }
            }))
            return NextResponse.json(items)

    }
    
}