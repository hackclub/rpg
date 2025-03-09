'use client'
import Button from "@/components/common/Button"
import Modal from "@/components/common/Modal"
import StatPill from "@/components/common/StatPill"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { multiFetcher } from "@/lib/fetch"
import Loading from "@/components/common/Loading"
import { Boss } from "@/types"
import { useRouter } from "next/navigation"

function SuccessModal({isFinishedOpen, setIsFinishedOpen, data, bossHealth}: {isFinishedOpen: boolean, setIsFinishedOpen: (value: any) => void, data?: any, bossHealth: Boss}){
    return (
    <Modal isOpen={isFinishedOpen} setIsOpen={setIsFinishedOpen} customClose="CLAIM REWARDS">
        <h1 className = "text-2xl md:text-5xl py-4">Battle Summary</h1>
            wow you finished a session thanks chat
            your session was {(data["duration"]/3600).toFixed(2) + " hours long (" + (data["duration"]/60).toFixed(2) + " minutes)"} 

        <h2>Prizes</h2>
        <div className = "flex flex-col flex-wrap gap-4">
            <StatPill>{Math.ceil(data["duration"]/60)} damage done! <span className = "text-accent">Boss health is now {bossHealth["health"]} </span></StatPill>
            <StatPill>+ {((data["duration"]/6) * 10).toFixed(0)} treasure </StatPill>
            <StatPill>+ {(data["duration"]*10).toFixed(0)} experience</StatPill>
        </div>
    </Modal>

)
}


export default function AttackButton(){
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isFinishedOpen, setIsFinishedOpen ] = useState(false)
    const [ isAttacking, setIsAttacking ] = useState(false)
    const { data, error, isLoading } = useSWR(["/api/attack/status?query=currently", "/api/attack/status?query=latest", "/api/boss/status"], multiFetcher, {
        keepPreviousData: true,
        refreshInterval: 250,
        onSuccess: (data) => {
          setIsAttacking(data[0]["attacking"])
        }
    })

    useEffect(() => {
        if (data){
          setIsAttacking(data[0]["attacking"])
        }
      }, [data])

    return (
        <>
        <div>
            { isLoading 
                ? <Button>Loading...</Button>
                : isAttacking 
                    ? <Button className = "mx-auto w-max" onClick={() => {fetch("/api/attack", { method: "POST", body: JSON.stringify({projectId: "SET ME TO THE ACTUAL PROJECT ID"})}); setIsFinishedOpen(true)}}>END ATTACK</Button>
                    : <Button className = "mx-auto w-max" onClick={() => setIsOpen(true)}>START ATTACKING</Button>
            }
        </div>
        {/* start session modal */}
         <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <h1 className = "text-2xl md:text-5xl py-4">Start adventuring</h1>
            <div className = "text-base sm:max-lg:text-sm">
                <p className = "font-bold text-accent">What project are you working on?</p>
                <p>WakaTime dropdown modal + option for not listed in wakatime w/ custom text -{'>'} store this in projects</p>
                <p className = "font-bold text-accent">Equip a weapon:</p>
                <p>Inventory options; weapons will give different multipliers</p>
                <Button className = "w-max mx-auto" onClick={() => 
                    {
                        fetch("/api/attack", { 
                        method: "POST", 
                        body: JSON.stringify(
                            {"projectId": "SET ME TO THE ACTUAL PROJECT ID"}) 
                            }); setIsOpen(false) }}>CLICK TO START</Button>
            </div>
         </Modal>

         {/* finish session modal */}
         { data && <SuccessModal isFinishedOpen={isFinishedOpen} setIsFinishedOpen={setIsFinishedOpen} data={data[1]} bossHealth={data[2]} /> }
        </>
    )
}