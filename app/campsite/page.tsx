import GeneralLayout from "../layouts/general"
import LargePill from "@/components/common/LargePill"
import prisma from "@/lib/prisma"
import { determineLevel } from "@/lib/stats"
import { getActiveBossDetails } from "@/lib/prisma"

const shineEffect = `rounded-l-lg bg-accent z-10 h-full text-center focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]`

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

    const activeBoss = (await getActiveBossDetails())!;
    return (
        <GeneralLayout title = "Campsite">

            <h1 className = "text-4xl">Greetings, adventurer!</h1>
            <p>Welcome to the campsite. Here, you can rest and recover before heading out to battle <span className = "text-accent font-bold">{activeBoss.name}</span>.</p>
            <div className = "flex flex-col gap-5">
                <div id = "current_boss-info" className = "w-full *:mx-auto text-center flex flex-col gap-2">
                    <img alt="Artwork promoting RPG relative" className = "w-1/2 p-4 rounded-lg" src = "/rpgfinal.png"/>
                    <div className = "rounded-lg h-8 w-8/12 bg-white/40 border border-accent/50">
                        <div className = {shineEffect} style={{width: Number(activeBoss.health/activeBoss.maxHealth * 100) + "%"}}/>
                    </div>
                    <span>{activeBoss.health} / {activeBoss.maxHealth} HP</span>
                </div>

            <div id = "current">
                <h2>Current Battles ⚔️ </h2>
                <p>Adventurers currently on quests</p>
                <div className = "flex flex-col gap-4 py-2"> 
                    { currentBattles.length > 0 ? currentBattles.map((battle: any, index: number) => 
                    <LargePill key={index}> 
                        <div className = "text-sm sm:text-base flex flex-row gap-4 items-center">
                            <img alt = {`${battle.user.name}'s profile picture`}  className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                            <div className = "grow"><span className ="text-accent">{battle.user.name!} (LVL {determineLevel(battle.user.experience)})</span> is battling right now! They're working on '{battle.project.name}'.</div>
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
                            <img alt = {`${battle.user.name}'s profile picture`} className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                            <div className = "grow"><span className = "text-accent">{battle.user.name} (LVL {determineLevel(battle.user.experience)})</span> did <span className = "text-accent">{battle.damage} damage</span> in a battle lasting {(battle.duration/3600).toFixed(2)} hours. They were working on '{battle.project.name}'</div>
                        </div>
                    </LargePill>
                    ) : <LargePill>No battles found! Or something went, very, very wrong.</LargePill>}
                </div>
            </div>
        </div>
        </GeneralLayout>
    )
}