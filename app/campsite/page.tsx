import GeneralLayout from "../layouts/general"
import LargePill from "../components/common/LargePill"
import prisma from "@/lib/prisma"
import { determineLevel } from "@/lib/stats"

export default async function Home(){
    const currentBattles = await prisma.battle.findMany({
        take: 3,
        orderBy: {
            createdAt: "desc"
        },
        where: { 
            AND: {
                user: {
                    battling: true
                },
                duration: 0 // duration == 0 means battle hsan't finished
        }
    }, 
    select: {
        user: true,
        project: true
    }})

    const recentBattles = await prisma.battle.findMany({
        take: 3,
        orderBy: {
            updatedAt: "desc"
        },
        where: { 
            NOT: {
                duration: 0 // session has a duration == session has finished
            }
        },
        select: {
            user: true,
            damage: true,
            duration: true,
            project: true
        }
    })     
    console.log(currentBattles)

    return (
        <GeneralLayout title = "Campsite">
            <p>Descriptive generic body text introducing users to the basic mechanics.</p>
            <p>Generic motivational text, countdown timer, overall statistics</p>
            <h2>Storyline/Plot</h2>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <img className = "w-1/2 mx-auto p-4 rounded-lg" src = "/rpgfinal.png"/>

            <div id = "current">
                <h2>Current Battles ⚔️ </h2>
                <p>Adventurers currently on quests</p>
                <div className = "flex flex-col gap-4 py-2"> 
                    { currentBattles.length > 0 ? currentBattles.map((battle: any, index: number) => 
                    <LargePill key={index}> 
                        <div className = "text-sm sm:text-base flex flex-row gap-4 items-center">
                            <img className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                            <div className = "grow"><span className ="text-accent">{battle.user.name!} (LVL {determineLevel(battle.user.experience)})</span> is battling right now! They're working on '{battle.project.name}'</div>
                        </div>
                    </LargePill>
                    ) : <LargePill>No one is battling right now :{'('}</LargePill>}
                    </div>         
            </div>  

            <div id = "recent">
                <h2>Recent Battles 🏕️</h2>
                <p>Adventurers who have returned from quests</p>
                <div className = "flex flex-col gap-4 py-2"> 
                    { recentBattles.length > 0 ? recentBattles.map((battle: any, index: number) => 
                    <LargePill key={index}> 
                        <div className = "text-sm sm:text-base flex flex-row gap-4 items-center">
                            <img className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                            <div className = "grow"><span className = "text-accent">{battle.user.name} (LVL {determineLevel(battle.user.experience)})</span> did <span className = "text-accent">{battle.damage} damage</span> in a battle lasting {(battle.duration/3600).toFixed(2)} hours. They were working on '{battle.project.name}'</div>
                        </div>
                    </LargePill>
                    ) : <LargePill>No battles found! Or something went, very, very wrong.</LargePill>}
                </div>
            </div>
        </GeneralLayout>
    )
}