import GeneralLayout from "../layouts/general"
import { LoadCurrentBattles, LoadRecentBattles, LoadCurrentBoss } from "@/components/BattleStatus"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
const shineEffect = `rounded-l-lg bg-accent z-10 h-full text-center focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]`
export default async function Home(){
    const session = await auth();
    return (
        <GeneralLayout title = "Campsite">
            <h1 className = "text-4xl">Greetings, adventurer!</h1>
            <p>Welcome to the campsite. Here, you can rest and recover before heading out to battle.</p>
            <div className = "flex flex-col gap-5">
                <div id = "current_boss-info" className = "w-full *:mx-auto text-center flex flex-col gap-2">
                <img alt="Artwork promoting RPG relative" className = "w-1/2 p-4 rounded-lg" src = "/rpgfinal.png"/>
                    <LoadCurrentBoss/>
                </div>

            <div id = "current">
                <h2>Current Battles ⚔️ </h2>
                <p>Adventurers currently on quests</p>
                <LoadCurrentBattles/>
            </div>  

            <div id = "recent">
                <h2>Recent Battles 🏕️</h2>
                <p>Adventurers who have returned from quests</p>
                <LoadRecentBattles/>
            </div>
        </div>
        </GeneralLayout>
    )
}