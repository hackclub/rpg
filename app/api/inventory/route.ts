// POST /api/inventory
// Equip selected item
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest){
    const session = await auth();
    if (!session){ 
        return NextResponse.json({error: "Unauthed", status: 401})
    }
    const item = (await request.json())["name"]
    const unequipItem = await prisma.item.updateMany({
        where: {
            user: {
                email: session?.user.email!
            },
            userEquipped: true
        },
        data: {
            userEquipped: false
        }
    })


    const equipItem = await prisma.item.updateMany({
        where: { 
            userId: session?.user.id!,
            name: String(item),
            },
            data: {
                userEquipped: true
            }

    })


    return NextResponse.json({message: `Equipped item`})
}