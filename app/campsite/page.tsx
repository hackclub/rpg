import GeneralLayout from "../layouts/general"
import { LoadCurrentBattles, LoadRecentBattles, LoadCurrentBoss, LoadCurrentAdventurers } from "@/components/BattleStatus"
import { ActiveUsers } from "@/components/BattleStatusClient";
import { auth } from "@/auth"
import LargePill from "@/components/common/LargePill";

export default async function Home(){
    const currentAdventurers = await LoadCurrentAdventurers();
    const session = await auth();
    return (
        <GeneralLayout title = "Campsite">
            <h1 className = "text-4xl">Greetings, adventurer!</h1>
            <p>Welcome to the campsite. Here, you can rest and recover before heading out to battle the latest boss.</p>
            <LargePill className = "my-4">
                📣  Finished with a project? Want your prizes? Submit it <a target="_blank" href = "https://forms.hackclub.com/rpg-v1" className = "text-accent link">here</a>!
            </LargePill>

            <div className = "flex flex-col gap-5">
                <div id = "current-boss-info" className = "w-full *:mx-auto text-center flex flex-col gap-2">
                    <LoadCurrentBoss/>
                </div>

            <div id = "current">
                <h2>Current Battles ⚔️ </h2>
                <ActiveUsers currentAdventurers={currentAdventurers as {nickname: string}[]}/>
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