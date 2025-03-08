import prisma from '@/lib/prisma'
import { Item } from "@/types/index"
const inventoryData: Item[] = [
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

async function main(){
    for (const u of inventoryData) {
        const item = await prisma.item.create({
          data: u,
        })
        console.log(`Created item with id: ${item.id}`)
    }
}

await main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })