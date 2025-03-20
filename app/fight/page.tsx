'use client'
import GeneralLayout from "../layouts/general";
import StatPill from "@/components/common/StatPill";
import BattleButton from "../../components/Battle";
import useSWR from "swr";
import { multiFetcher } from "@/lib/fetch";
import { Boss } from "@/types";
import Loading from "../../components/common/Loading";
import Button from "@/components/common/Button";

export default function Fight(){
    const { data, error, isLoading } = useSWR(
        ["/api/boss/status?query=all", "/api/battle/status?query=currently", "/api/battle/status?query=latest"], multiFetcher, {
        refreshInterval: 250
    })
    if (error){
        return ( 
            <GeneralLayout title = "Error!">
                {error.desc}
            </GeneralLayout>
        )
    }
    if (isLoading){
        return (
            <Loading/>
        )
    }
    let bosses, currentlyBattling: any, bossInLatestSession: any

    if (data){
        bosses = data[0]
        currentlyBattling = data[1]["battling"]
    }
    if (data && data[2]){
        bossInLatestSession = data[2]["boss"]["name"]
    }

    return (
        <GeneralLayout title = "Fight!">
            <div className = "flex flex-col gap-5">
            { bosses?.map((boss: Boss, index: number) => 
                <div key={index} className = "flex flex-col lg:flex-row gap-7 bg-accent/20 border border-accent/50 p-4 my-8 md:my-0 rounded-sm">
                    <div className = "bg-gray-20 lg:w-5/12 rounded-sm flex flex-col gap-5 justify-center items-center">
                        <img alt={boss.name} src = {boss.image}/>
                        <div className = "mx-auto">
                            <StatPill> {boss.health > 0 ? <span>Health: {boss.health} / {boss.maxHealth}</span> : <span className = "flex flex-row gap-2 items-center">Slain by <img alt = {`${boss.slainBy!.name}'s profile picture`} src={boss.slainBy?.image!} className="inline size-4 rounded-full"/> {boss.slainBy!.name}</span> }</StatPill>
                        </div>
                    </div>
                    <div className = "text-center lg:text-left flex flex-col lg:w-7/12">
                        <div className = "grow">
                            <h2 className = "mt-0">{boss.name}</h2>
                            <p>{boss.desc}</p>
                            <img alt={boss.name} className = "mx-auto h-4 md:h-8 my-3" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/91b633bcae556a5d55141fcb9fcc85ae80a85a8f_ccdiv-removebg-preview.png"/>
                            <p><b className = "text-accent">Strength: </b>{boss.strength} projects do half damage :{'('}</p>
                            <p><b className = "text-accent">Weakness: </b>{boss.weakness} projects do double damage!</p>
                        </div>

                        { boss.health > 0 || (currentlyBattling && bossInLatestSession == boss.name)
                            ? <BattleButton/> 
                            : <div className = "mx-auto flex items-center flex-col text-sm">
                                    <Button disabled>DEFEATED!</Button>
                              </div>
                            }
                    </div>
                </div>
                )}
            </div>
        </GeneralLayout> 
    )
}