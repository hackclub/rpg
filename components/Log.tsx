'use client'
import Modal from "./common/Modal";
import LargePill from "./common/LargePill";
import StatPill from "@/components/common/StatPill";
import { Battle } from "@prisma/client";
import useSWR from "swr";
import { multiFetcher } from "@/lib/fetch";
import { useSession } from "next-auth/react";
export default function Log({logIsOpen, setLogIsOpen}: {logIsOpen: boolean, setLogIsOpen: (value: any) => void}){
    const session = useSession()
    const { data, error, isLoading } = useSWR(["/api/battle/status?query=all", `/api/public/${session.data?.user.providerAccountId}`, "/api/project/status"], multiFetcher)
    let battles: Battle[] = []
    let timeSpentInBattle: number = 0
    let projects: { name: string, duration: number }[] = []

    if (data){
        battles = data[0]
        timeSpentInBattle = data[1]["timeInBattle"]
        projects = data[2]
    }

    return (
        <Modal isOpen={logIsOpen} setIsOpen={setLogIsOpen}>
        <h1 className = "text-3xl md:text-5xl py-4">Battle Log</h1>
        <p>You've spent {(timeSpentInBattle/3600).toFixed(2)} hours / {(timeSpentInBattle/60).toFixed(2)} minutes in battle.
            <br/> During your battles, you spent time working on these projects: 
        </p>
        <div className = "py-2 h-1/2">
            <div className = "flex flex-col gap-4">
                <div className = "flex flex-row gap-2 flex-wrap">
                    { projects.map((project, index: number) => 
                        project.duration !== undefined ?
                            <StatPill key={index}>
                                <span className = "text-sm sm:text-base">
                                    {project.name} ({(project.duration/3600).toFixed(2)} hours)
                                </span>
                            </StatPill> : null
                    )}
                </div>
                    {battles.length > 0 
                        ? battles.map((battle: any, index: number) => 
                    <LargePill key={index} >
                        <div className = "lg:grid lg:grid-cols-4 gap-3">
                        <div className = "col-span-1 flex flex-col gap-1">
                            <div className = "inline md:block">
                                <span className = "text-accent font-bold underline decoration-wavy underline-offset-2">{String(new Date(battle.createdAt).toDateString())}                             {' - '}
                                {battle.project.name} (#{battle.project.id})</span>
                            </div>
                            <ul className = "inline md:block list-disc list-inside">
                                <li>{(battle.duration/3600).toFixed(2)}h / {(battle.duration/60).toFixed(2)}m / {battle.duration}s</li>
                                <li>{battle.damage} damage</li>
                                <li>{battle.boss.name}</li>
                                <li>Status: {battle?.scrap?.[0]?.status}</li>
                            </ul>
                        </div>

                        <div className = "flex flex-col col-span-3 gap-1">
                            <span className = "text-accent font-bold underline decoration-wavy underline-offset-2">Scrap #{battle?.scrap?.[0]?.id} </span>

                            <span className = "text-accent">Description: </span>
                            {battle?.scrap?.[0]?.description}
                            <span><span className = "text-accent">Media URL: </span><a target="_blank" href = {battle?.scrap?.[0]?.url}>{battle?.scrap?.[0]?.url}</a></span>
                            <span><span className = "text-accent">Commit URL: </span><a target="_blank" href = {battle?.scrap?.[0]?.codeUrl}>{battle?.scrap?.[0]?.codeUrl}</a></span>
                        </div>

                    
                        </div>
                    </LargePill> 
                    )
                : <LargePill>No battles logged! You should start a new battle in the Fight menu :D</LargePill>}
                </div>
            </div>
    </Modal>
    )
}