import { PrismaClient } from "@prisma/client"
import { Item } from "@/types"
 
export const inventoryData: Item[] = [
    {
        name: "Wooden sword",
        desc: "A trusty weapon.",
        image: "https://placehold.co/40x40",
        rarity: 1
    },
    {
        name: "Bow and arrow",
        desc: "May your aim be as true as your heart is pure.",
        image: "https://placehold.co/40x40",
        rarity: 1
    },
    {
        name: "Pure nail",
        desc: "Fit for a bug.",
        image: "https://placehold.co/40x40",
        rarity: 3
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
        data: newInventory.splice(2)
    })
}


export default prisma