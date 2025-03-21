'use client'
import Modal from "./common/Modal";
import LargePill from "./common/LargePill";
import { Battle } from "@prisma/client";
import useSWR from "swr";
import { multiFetcher } from "@/lib/fetch";

export default function Log({logIsOpen, setLogIsOpen}: {logIsOpen: boolean, setLogIsOpen: (value: any) => void}){
    const { data, error, isLoading } = useSWR(["/api/battle/status?query=all"], multiFetcher)
    let battles: Battle[] = []
    if (data){
        battles = data![0]
    }

    return (
        <Modal isOpen={logIsOpen} setIsOpen={setLogIsOpen}>
        <h1 className = "text-3xl md:text-5xl py-4">Battle Log</h1>
            <div className = "flex flex-col gap-4 py-8">
                {battles.length > 0 ? 
                
                battles.map((battle: any, index: number) => 
                <LargePill key={index} >
                    <div className = "lg:grid lg:grid-cols-4 gap-3">
                    <div className = "col-span-1 flex flex-col gap-1">
                        <div className = "inline md:block">
                            <span className = "text-accent font-bold">{String(new Date(battle.createdAt).toDateString())}                             {' - '}
                            {battle.project.name}</span>
                        </div>
                        <ul className = "inline md:block list-disc list-inside">
                            <li>{(battle.duration/3600).toFixed(2)} hours ({battle.duration} seconds)</li>
                            <li>{battle.damage} damage</li>
                            <li>{battle.boss.name}</li>
                            <li>Status: {battle?.scrap?.[0]?.status}</li>
                        </ul>
                    </div>

                    <div className = "flex flex-col col-span-3 gap-1">
                        <span className = "text-accent font-bold">Description: </span>
                        {battle?.scrap?.[0]?.description}
                    </div>
                
                    </div>
                </LargePill> 
                )
             : <LargePill>No battles logged! You should start a new battle in the Fight menu :D</LargePill>}
            </div>
    </Modal>
    )
}