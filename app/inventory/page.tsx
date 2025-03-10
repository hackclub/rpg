import GeneralLayout from "@/app/layouts/general";
import prisma from "@/lib/prisma";
import Items from "../components/ItemInventory";
import { auth } from "@/auth";

export default async function Inventory(){
    return (
        <GeneralLayout title = "Inventory">
            Inventory items go here. Also, treasure counts and such.
            <Items/>
        </GeneralLayout>
    )
}