import prisma from '@/lib/prisma'
import { Item } from "@/types/index"
import { inventoryData } from '@/lib/prisma'

async function main(){
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "example@mail.com"
    }
  })

  const newInventory = inventoryData.map((item: Item) => ({
    ...item,
    userId: admin.id
  }))

  const item = await prisma.item.createMany({
      data: newInventory
  })  
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