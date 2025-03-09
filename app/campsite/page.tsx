import GeneralLayout from "../layouts/general"
import LargePill from "../components/common/LargePill"
import prisma from "@/lib/prisma"

export default async function Home(){
    const recentBattles = await prisma.battle.findMany({
        take: 5,
        orderBy: {
            updatedAt: "desc"
        },
        where: {
            user: {
                battling: false // user has completed the battle
            }
        },
        select: {
            user: true,
            damage: true,
            duration: true,
            projectId: true
        }
    })
    return (
        <GeneralLayout title = "Campsite">
            <p>Descriptive generic body text introducing users to the basic mechanics.</p>
            <p>Generic motivational text, countdown timer, overall statistics</p>
            <h2>Storyline/Plot</h2>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <img className = "w-1/2 mx-auto p-4 rounded-lg" src = "/rpgfinal.png"/>
            <h2>Recent battles</h2>
            <div className = "flex flex-col gap-4"> 
                { recentBattles.map((battle, index) => 
                <LargePill key={index}> 
                    <div className = "flex flex-row gap-4">
                        <img className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                        <div className = "grow">{battle.user.name} did {battle.damage} damage in a battle lasting {(battle.duration/3600).toFixed(2)} hours. They were working on '{battle.projectId}'</div>
                    </div>
                </LargePill>
                )}
                </div>
        </GeneralLayout>
    )
}