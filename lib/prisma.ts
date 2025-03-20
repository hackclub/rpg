import { PrismaClient } from "@prisma/client"
import { Item, Boss } from "@/types"

export const inventoryData: Item[] = [
    {
        name: "Wooden sword",
        desc: "A trusty weapon.",
        image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/9db948ec8bb9adb03d0eacef807cb1e2ffa5fb55_swordt2.png",
        rarity: 1,
        multiplier: 1.0 
    },
    {
        name: "Bow and arrow",
        desc: "May your aim be as true as your heart is pure.",
        image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/e46f23eadc42a58f72dea9c9f77fc2b760bd558b_bowt2.png",
        rarity: 1,
        multiplier: 1.1
    },
    {
        name: "Pure nail",
        desc: "Fit for a bug.",
        image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/4b0cf9759bb53dac61b28a06d6ecfe728117b010_image.png",
        rarity: 3,
        multiplier: 1.3
    },
    {
        name: "Rocket Propelled Grenade",
        desc: "What else would RPG stand for?",
        image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/573e0a0c3c05cbfc8e6030d585957a2768ee769d_wandt2.png",
        rarity: 3,
        multiplier: 1.4
    },
]

export const bossData = [
    {
        name: "The Red Dragon",
        image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/9a64303ec0434cc31c9a85f38053d70d52fe05a6_boss1.png",
        desc: "A hoarder of treasure, ready to defend its stash from those who dare challenge it.",
        strength: "Web development",
        weakness: "Game development",
        health: 1000,
        maxHealth: 1000,
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
        userEquipped: false,
        userId: userId
    })
        
    )
    await prisma.item.createMany({
        data: newInventory.splice(0,2)
    })
}

export async function isCurrentlyBattling(email: string){
    const getBattlingStatus = await prisma.user.findFirst({
        where: {
            email: email
        },
        select: {
            battling: true,
            paused: true
        }
    })
    return (await getBattlingStatus)
}

export async function getLatestSessionDetails(userId: string){
    const latestSession = await prisma.battle.findFirst({
        where: {
            userId: userId,
        },
        orderBy: {
        createdAt: 'desc', 
        },
        select: {
            id: true,
            duration: true,
            createdAt: true,
            effect: true,
            project: true,
            multiplier: true,
            timePaused: true,
            timesPaused: true,
            timesUnpaused: true,
            boss: {
                select: {
                    name: true,
                    health: true
                }
            }
        }
    })
    return latestSession
}

export async function getCurrentBattleDetails(){
    const response = await prisma.battle.findFirst({
        where: {
            user:
                { battling: true}
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return response
}

export async function getActiveBossDetails(){
    const response = await prisma.boss.findFirst({
        where: {
            active: true
        },
        include: {
            slainBy: {
                select: {
                        name: true,
                        image: true
                }
            },
        }
    })
    return response
}

export async function getAllBossDetails(){
    const response = await prisma.boss.findMany({
        include: {
            slainBy: {
                select: {
                        name: true,
                        image: true
                }
            }
        },
        orderBy: {
            id: "desc"
        }
    })
    return response
}

export async function getAllUserBattles(userId: string){
    const response = await prisma.battle.findMany({
        where: {
            userId: userId,
            NOT: {
                duration: 0
            }
        },
        orderBy: {
            createdAt: "desc"
        }, 
        select: {
            damage: true,
            duration: true,
            user: true,
            project: true,
            createdAt: true,
            updatedAt: true,
            boss: true,
            scrap: true
        }
    })
    return response
}

export default prisma