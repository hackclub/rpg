import prisma from '@/lib/prisma'
import { Item, Boss} from "@/types/index"
import { inventoryData, bossData } from '@/lib/prisma'

async function seedBosses(){
  const bosses = await prisma.boss.createMany({
    data: bossData.map((boss: Boss) => ({
      ...boss,
  }))
})}

async function main(){
  const userCount = await prisma.user.findMany()
  if (!userCount.length){
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "example@mail.com",
        providerAccountId: "example"
      }
    })

    const item = await prisma.item.createMany({
        data: inventoryData.map((item: Item) => ({
          ...item,
          userId: admin.id
        }))
    })  

    seedBosses()
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