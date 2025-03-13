import GeneralLayout from "@/app/layouts/general";
import Items from "@/components/ItemInventory";
import Shop from "@/components/Shop";
import { auth } from "@/auth";
import StatPill from "../components/common/StatPill";
export default async function Inventory(){
    const session = await auth();
    return (
        <GeneralLayout title = "Inventory">
            You have <StatPill className = "inline">{session?.user.treasure}</StatPill> treasure.
            It's dangerous to go alone, take these!
            <Items/>
            <Shop/>
        </GeneralLayout>
    )
}