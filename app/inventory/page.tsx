import GeneralLayout from "@/app/layouts/general";
import Items from "@/components/ItemInventory";
import Shop from "@/components/Shop";
import { auth } from "@/auth";
import StatPill from "@/components/common/StatPill";
export default async function Inventory(){
    const session = await auth();
    return (
        <GeneralLayout title = "Inventory">
            <p>
                You have <StatPill className = "inline">{session?.user.treasure}</StatPill> treasure.
            </p>
            <p>
                It's dangerous to go alone, take these!
            </p>
            <Items/>
            <h2>Shop</h2>
            <Shop/>
        </GeneralLayout>
    )
}