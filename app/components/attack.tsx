'use client'
import Button from "@/components/common/Button"
import Modal from "./common/Modal"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { multiFetcher } from "@/lib/fetch"

export default function AttackButton(){
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isFinishedOpen, setIsFinishedOpen ] = useState(false)
    const [ isAttacking, setIsAttacking ] = useState(false)
    const { data, error, isLoading } = useSWR(["/api/attack/status?query=currently", "/api/attack/status?query=latest"], multiFetcher, {
        refreshInterval: 250,
        onSuccess: (data) => {
            console.log(data[1])
          setIsAttacking(data[0]["message"])
        }
    })

    useEffect(() => {
        if (data){
          setIsAttacking(data[0]["message"])
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
         <Modal isOpen={isFinishedOpen} setIsOpen={setIsFinishedOpen}>
         <h1 className = "text-2xl md:text-5xl py-4">Battle Summary</h1>
             wow you finished a session thanks chat
            your session was { data
                                ? data[1]
                                    ?  (data[1]["duration"]/3600).toFixed(2) + " hours long (" + (data[1]["duration"]/60).toFixed(2) + " minutes)"
                                    : "[Something went wrong - no response to ?query=latest]" 
                                : "[Something went wrong - no response to /api/attack/status]"} 
         </Modal>
         </>
    )
}