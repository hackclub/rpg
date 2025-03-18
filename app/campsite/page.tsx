import GeneralLayout from "../layouts/general"
import { LoadCurrentBattles, LoadRecentBattles, LoadCurrentBoss, LoadCurrentAdventurers } from "@/components/BattleStatus"
import { auth } from "@/auth"
export default async function Home(){
    const session = await auth();
    return (
        <GeneralLayout title = "Campsite">
            <h1 className = "text-4xl">Greetings, adventurer!</h1>
            <p>Welcome to the campsite. Here, you can rest and recover before heading out to battle the latest boss.</p>
            <div className = "flex flex-col gap-5">
                <div id = "current-boss-info" className = "w-full *:mx-auto text-center flex flex-col gap-2">
                    <LoadCurrentBoss/>
                </div>

            <div id = "current">
                <h2>Current Battles ⚔️ </h2>
                <LoadCurrentAdventurers/>
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