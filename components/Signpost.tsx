'use client'
import { useSession } from "next-auth/react"
import Sign from "@/components/common/Sign"
import StatPill from "@/components/common/StatPill"
import { Tooltip } from "react-tooltip"
import { determineLevel } from "@/lib/stats"

const directory = [{
    name: "Campsite",
    link: "/campsite"
},
{
    name: "Inventory",
    link: "/inventory"
},
{
    name: "Leaderboard",
    link: "/leaderboard"
},
{
    name: "FIGHT!",
    link: "/fight"
}]

export default function Signpost({className}: {className: string}){
    const session = useSession();
    return (
        <div className = {`${className}`}>
            <img alt="Header (top)" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
                <h1 className ="text-3xl sm:text-5xl text-center">signpost</h1>
                <div className = "py-4">
                    {directory.map((item, index) => 
                    <Sign key = {index} href={item.link}>{item.name}</Sign> 
                    )}
                </div>
            <img alt="Header (bottom)" className = "rotate-180" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
            <span className = "flex flex-row justify-between w-full pt-4">
                <Tooltip id="experience"/>

                <StatPill>
                    <img alt={`${session.data?.user.name}'s profile picture`}src = {session.data?.user.image!} className="inline size-4 rounded-full"/>
                    { session.data?.user.name } 
                </StatPill>
                    <StatPill>
                    <span data-tooltip-id="experience" data-tooltip-content={String(session.data?.user.experience) + " exp"}>
                        LVL { determineLevel(session.data?.user.experience!) } 
                        </span>
                    </StatPill>
                <StatPill> 
                    { session.data?.user.treasure } treasure
                </StatPill>

            </span>
        </div>
    )
}