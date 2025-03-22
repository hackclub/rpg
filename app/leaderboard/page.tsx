import GeneralLayout from "../layouts/general";
import LargePill from "@/components/common/LargePill";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Impersonate from "@/components/Impersonate";
import { determineLevel } from "@/lib/stats";

export default async function Leaderboard(){
    const session = await auth();
    const treasureLeaderboard = await prisma.user.findMany({
        where: {
            NOT: {
                email: "example@mail.com",
            },
            treasure: {
                gt: 0
            }
        },
        orderBy: {
            treasure: "desc"
        },
        select: {
            nickname: true,
            providerAccountId: true,
            image: true,
            treasure: true,
            experience: true,
        }
    })

    return (
        <GeneralLayout title = "Leaderboard">
            Who's the best adventurer in these lands?
            <h2>Treasure</h2>
            <div className = "flex flex-col gap-4">
            { treasureLeaderboard.map((user: any, index: number) => 
                <LargePill key={index}> 
                    <div className = "flex sm:flex-row gap-5 w-full items-center">
                    <span className = "text-sm sm:text-base">{index + 1}</span> 
                    <span className = "flex flex-row gap-2 text-sm sm:text-base"><img alt={`${user.nickname}'s profile picture`} className = "align-middle size-5 inline rounded-full" src = {user.image!}/>{user.nickname} (LVL {determineLevel(user.experience)})                 
                        <Impersonate user={user}/> 
                    </span> 
                    <span className = "ml-auto text-sm sm:text-base">{user.treasure} <img className = "inline sm:hidden align-middle size-4 sm:size-10" alt = "Treasure" src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/7eafdce94e9f2440f6d4c7382165984d0eb9c53a_coin.png"/> <span className = "hidden sm:inline">treasure</span></span>
                    </div>
                </LargePill> 
            )}
            </div>
        </GeneralLayout>
    )
}