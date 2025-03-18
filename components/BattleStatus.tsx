"use server"
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { getActiveBossDetails } from "@/lib/prisma";
import LargePill from "./common/LargePill";
const shineEffect = `rounded-l-lg bg-accent z-10 h-full text-center focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]`
import { determineLevel } from "@/lib/stats";

export async function LoadCurrentBoss(){
    const activeBoss = (await getActiveBossDetails())!;

    if (!activeBoss){
        return (
            <div>No bosses active!</div>
        )
    }
    return (
        <>           
        <Suspense fallback={<div>loading</div>}>
            <img alt = {activeBoss.name} src = {activeBoss.image} className="w-1/2 p-4 rounded-lg"/>
            <p>{activeBoss.name}</p>

                <div className = "rounded-lg h-8 w-8/12 bg-white/40 border border-accent/50">
                    <div className = {shineEffect} style={{width: Number(activeBoss.health/activeBoss.maxHealth * 100) + "%"}}/>
                </div>
                <span>{activeBoss.health} / {activeBoss.maxHealth} HP</span>

            </Suspense>
        </>
    )
}


export async function LoadCurrentBattles(){
    const currentBattles = await prisma.battle.findMany({
        take: 3,
        orderBy: {
            createdAt: "desc"
        },
        where: {
                user: {
                    battling: true
                },
                duration: 0 // duration == 0 means battle hsan't finished
        },
    select: {
        user: true,
        project: true
    }})

    return (
        <Suspense fallback={<div>loading</div>}>
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
        </Suspense> 
    )
}

export async function LoadRecentBattles(){
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
    return (
        <Suspense fallback={<div>loading</div>}>
            <div className = "flex flex-col gap-4 py-2"> 
            { recentBattles.length > 0 ? recentBattles.map((battle: any, index: number) => 
            <LargePill key={index}> 
                <div className = "text-sm sm:text-base flex flex-row gap-4 items-center">
                    <img alt = {`${battle.user.name}'s profile picture`} className = "align-middle size-12 hidden sm:inline rounded-full" src = {battle.user.image!}/> 
                    <div className = "grow"><span className = "text-accent">{battle.user.name} (LVL {determineLevel(battle.user.experience)})</span> did <span className = "text-accent">{battle.damage} damage</span> in a battle lasting {(battle.duration/3600).toFixed(2)} hours. They were working on '{battle.project.name}'</div>
                </div>
            </LargePill>
            ) : <LargePill>No battles found!</LargePill>}
        </div>
    </Suspense>
    )
}


export async function LoadCurrentAdventurers(){
    const count = await prisma.user.findMany({
        where: {
            battling: true
        }
    })
    console.log(count)
    return count
}