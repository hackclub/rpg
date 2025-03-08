import GeneralLayout from "@/app/layouts/general";
import prisma from "@/lib/prisma";
import Items from "../components/ItemInventory";
import { auth } from "@/auth";

export default async function Inventory(){
    const session = await auth();

    const items = await prisma.user.findFirst({
        where: {
            email: {
                equals: session?.user.email!
            }
        },
        select: {
            inventory: true
        }
    })

    const old = "flex flex-row justify-between py-4 gap-y-20 sm:gap-x-16 md:gap-20 flex-wrap"
    return (
        <GeneralLayout title = "Inventory">
            Inventory items go here. Also, treasure counts and such.
            <div className = "grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] justify-between py-4 gap-y-16 gap-16 flex-wrap">
                <Items items={items!["inventory"]}/>
            </div>
        </GeneralLayout>
    )
}