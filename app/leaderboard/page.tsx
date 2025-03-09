import GeneralLayout from "../layouts/general";
import LargePill from "../components/common/LargePill";
import prisma from "@/lib/prisma";

export default async function Leaderboard(){
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
            Who's the best adventure in these lands?
            <h2>Treasure</h2>
            { treasureLeaderboard.map((user, index) => 
                <LargePill key={index}> 
                    <div className = "flex sm:flex-row gap-5 w-full">
                    <span>{index + 1}</span> 
                    <span className = "flex flex-row gap-2"><img className = "align-middle size-5 inline rounded-full" src = {user.image!}/>    {user.name}</span> 
                    <span className = "ml-auto">{user.treasure} t<span className = "hidden sm:inline">reasure</span></span>
                    </div>
                </LargePill>
            )}
        </GeneralLayout>
    )
}