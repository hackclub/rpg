import GeneralLayout from "@/app/layouts/general";
import prisma from "@/lib/prisma";
import Items from "../components/ItemInventory";


export default async function Inventory(){
    const items = await prisma.item.findMany()
    return (
        <GeneralLayout title = "Inventory">
            Inventory items go here. Also, treasure counts and such.
            <div className = "flex flex-row justify-between py-4 gap-y-20 sm:gap-x-16 md:gap-20 flex-wrap">
                <Items items={items}/>
            </div>
        </GeneralLayout>
    )
}