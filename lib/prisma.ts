import { PrismaClient } from "@prisma/client"
import { Item, Boss } from "@/types"
 
export const inventoryData: Item[] = [
    {
        name: "Wooden sword",
        desc: "A trusty weapon.",
        image: "https://placehold.co/40x40",
        rarity: 1,
        multiplier: 1.0 
    },
    {
        name: "Bow and arrow",
        desc: "May your aim be as true as your heart is pure.",
        image: "https://placehold.co/40x40",
        rarity: 1,
        multiplier: 1.1
    },
    {
        name: "Pure nail",
        desc: "Fit for a bug.",
        image: "https://placehold.co/40x40",
        rarity: 3,
        multiplier: 2
    }
]

export const bossData: Boss[] = [
    {
        name: "Generic Boss Name",
        image: "https://placehold.co/800x600",
        desc: "A ferocious beast, come to slay the adventurers who dare challenge it.",
        strength: "Web development projects do half the damage :(",
        weakness: "Game development projects do twice as much damage!",
        health: 200,
        maxHealth: 200,
        active: true,
    }
]


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


// New users will automatically be given the first two items.
export async function setUserDefaultInventory(userId: string){
    const newInventory = inventoryData.map((item: Item) => ({
        ...item,
        userId: userId
    })
        
    )
    await prisma.item.createMany({
        data: newInventory.splice(0,2)
    })
}

export async function isCurrentlyAttacking(email: string){
    const getAttackingStatus = await prisma.user.findFirst({
        where: {
            email: email
        },
        select: {
            attacking: true
        }
    })
    return (await getAttackingStatus)
}

export async function getLatestSessionDetails(userId: string){
    const latestSession = await prisma.attack.findFirst({
        where: {
            userId: userId
        },
        orderBy: {
        createdAt: 'desc', 
        },
        select: {
            id: true,
            duration: true,
            createdAt: true,
        }
    })
    return latestSession
}

export async function getActiveBossDetails(){
    const response = await prisma.boss.findFirst({
        where: {
            active: true
        }
    })
    return response
}

export default prisma