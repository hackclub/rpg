import GeneralLayout from "../layouts/general";
import LargePill from "@/components/common/LargePill";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Leaderboard(){
    const session = await auth();
    const treasureLeaderboard = await prisma.user.findMany({
        where: {
            NOT: {
                email: "example@mail.com"
            }
        },
        take: 10,
        orderBy: {
            treasure: "desc"
        },
        select: {
            name: true,
            image: true,
            treasure: true,
        }
    })

    return (
        <GeneralLayout title = "Leaderboard">
            Who's the best adventurer in these lands?
            <h2>Treasure</h2>
            { treasureLeaderboard.map((user: any, index: number) => 
                <LargePill key={index}> 
                    <div className = "flex sm:flex-row gap-5 w-full">
                    <span>{index + 1}</span> 
                    <span className = "flex flex-row gap-2"><img alt={`${user.name}'s profile picture`} className = "align-middle size-5 inline rounded-full" src = {user.image!}/>{user.name}</span> 
                    <span className = "ml-auto">{user.treasure} t<span className = "hidden sm:inline">reasure</span></span>
                    </div>
                </LargePill>
            )}
        </GeneralLayout>
    )
}