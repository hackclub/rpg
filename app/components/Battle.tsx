'use client'
import Button from "@/components/common/Button"
import Modal from "@/components/common/Modal"
import StatPill from "@/components/common/StatPill"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { multiFetcher } from "@/lib/fetch"
import { Boss, Project } from "@/types"
import { determineDamage, determineTreasure, determineExperience } from "@/lib/stats";
import Items from "./ItemInventory"
import { Battle } from "@prisma/client"
import { useSession } from "next-auth/react"
import Form from 'next/form';

const battleCompleteFlavourText = [
    "Returning triumphant from your battle against $BOSSNAME, you survey your rewards.",
    "You arrive at your campsite, victorious, and take stock of what you've taken from $BOSSNAME",
]

export default function BattleButton(){
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isFinishedOpen, setIsFinishedOpen ] = useState(false)
    const [ isBattling, setIsBattling ] = useState(false)
    const [ weaponMultiplier, setWeaponMultiplier ] = useState(1)
    const [ selectedProject, setSelectedProject ] = useState("")
    const [ customProject, setCustomProject ] = useState("")
    const session = useSession()
    const urls = [
        "/api/battle/status?query=currently", 
        "/api/battle/status?query=latest", 
        "/api/boss/status", 
        `https://waka.hackclub.com/api/compat/wakatime/v1/users/${session.data?.user.providerAccountId}/stats/last_30_days`,
        "/api/project/status"]
    const { data, error, isLoading, mutate } = useSWR(urls, multiFetcher, {
        refreshInterval:  250,
        onSuccess: (data) => {
            console.log(data)
          setIsBattling(data[0]["battling"])
        }
    })

    useEffect(() => {
        if (data){
          setIsBattling(data[0]["battling"])
        }
      }, [data])

    let projects 
    if (isLoading){
        return <div>Loading...</div>
    }
    if (data){
        projects = (data[3]["data"]["projects"]).concat(data[4])
    }

    function clearStates(){
        setSelectedProject("")
        setCustomProject("")
    }

    async function handleBattleStart(){
        let getCurrentEquippedWeapon = (await fetch("/api/inventory/status?query=equipped", {cache: "no-store"}).then(r=> r.json()))[0]
        let multiplier = getCurrentEquippedWeapon ? getCurrentEquippedWeapon["multiplier"] : 1

        const projectToDB = selectedProject !== "_other" ? selectedProject.replace(/[^a-zA-Z0-9-]/g, '') : customProject.replace(/[^a-zA-Z0-9-]/g, '')
        const createProject = fetch("/api/project", {
                method: "POST",
                body: JSON.stringify(
                    {
                        "name": projectToDB,
                        "customProject": selectedProject === "_other"
                    }
                )
            }
        )
        const r = fetch("/api/battle", { 
            method: "POST", 
            body: JSON.stringify(
                {"projectId": selectedProject !== "_other" ? selectedProject : customProject}) 
            }); 
        setIsOpen(false); 
        setWeaponMultiplier(multiplier)
    }

    return (
        <>
        <div>
            { isLoading 
                ? <Button>Loading...</Button>
                : isBattling 
                    ? <Button className = "mx-auto w-max" onClick={async () => { await fetch("/api/battle", { method: "POST", body: JSON.stringify({projectId: "SET ME TO THE ACTUAL PROJECT ID", multiplier: weaponMultiplier})}); setIsFinishedOpen(true);  mutate()}}>END BATTLE</Button>
                    : <Button className = "mx-auto w-max" onClick={async () => { setIsOpen(true)}} >START BATTLE</Button>
            }
        </div>
        {/* start session modal */}
         <Modal isOpen={isOpen} setIsOpen={setIsOpen} customCloseAction={clearStates}>
            <h1 className = "text-2xl md:text-5xl py-4">Start adventuring</h1>
            <div className = "text-base sm:max-lg:text-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className = "col-span-1">
                    <Form className = "flex flex-col gap-4" action="javascript:void(0);" onSubmit={(e) => { e.preventDefault() }}>
                        <div className = "flex flex-col gap-1">
                            <label htmlFor="project" className = "font-bold text-accent">What project are you working on?</label>
                            <select className="flex flex-col gap-1" name = "project" id="project" defaultValue="Select a project" onChange={(e) => {setSelectedProject(e.target.value)}}>
                                <option value = "_select">[Select a project]</option> {/* fix: make sure users can't select this option */}
                                {projects && projects.map((project: Project, index: number) => 
                                    <option key={index} value = {project.name}>{project.name}</option>
                                )}
                                <option value="_other">[Other project not listed here]</option>
                            </select>
                        </div>

                        { selectedProject === "_other" 
                            ?  <div className = "flex flex-col gap-1"><label className = "font-bold text-accent block">Enter project name: </label> <input onChange={(e) => {setCustomProject(e.target.value); console.log(customProject)}} type = "text" id="project"></input></div>
                            : null }
                    </Form>
                </div>
                <div className = "col-span-1">
                <p className = "font-bold text-accent">Equip a weapon:</p>
                    <Items/>
                </div>
            </div>
            { selectedProject === "_select" ||  selectedProject === "" || ( selectedProject == "_other" && !customProject)
                ? <Button disabled={true} className = "w-max mx-auto">SELECT A PROJECT</Button>
                : <Button className = "w-max mx-auto" onClick={async () => {handleBattleStart(); mutate(); clearStates();}}>CLICK TO START</Button>
            }
         </Modal>

         {/* finish session modal */}
         { data && data[1] && <SuccessModal states={{isFinishedOpen, setIsFinishedOpen}} data={data[1]} boss={data[2]} mutateOnClose={mutate} weaponMultiplier={weaponMultiplier}/> }
        </>
    )
}


interface States {
    isFinishedOpen: boolean,
    setIsFinishedOpen: (value: any) => void
}

function SuccessModal({states, boss, mutateOnClose, data, weaponMultiplier}: {states: States, boss: Boss, mutateOnClose: () => void, weaponMultiplier: number, data: Battle}){
    const damage = determineDamage(data["duration"], weaponMultiplier)
    const treasure = determineTreasure(data["duration"], weaponMultiplier)
    const experience = determineExperience(data["duration"], weaponMultiplier)
    return (
        <Modal isOpen={states.isFinishedOpen} setIsOpen={states.setIsFinishedOpen} customClose="CLAIM REWARDS" customCloseAction={mutateOnClose}>
            <h1 className = "text-3xl md:text-5xl py-4 align-middle">
            <svg xmlns="http://www.w3.org/2000/svg" className = "inline size-6 md:size-12 mr-2 md:mr-4" fill="#fff" viewBox="0 0 256 256"><path d="M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z"></path></svg>
                Battle Summary
            </h1>
                { battleCompleteFlavourText[Math.floor(Math.random() * battleCompleteFlavourText.length)].replace("$BOSSNAME", boss["name"]) }
                <p>Your session was {(data["duration"]/3600).toFixed(2) + " hours long (" + (data["duration"]/60).toFixed(2) + " minutes)"}</p>

            <h2>Prizes</h2>
            <div className = "flex flex-col flex-wrap gap-4 items-center lg:items-start">
                <StatPill>{damage} damage done! <span className = "text-accent">Boss HP: {boss["health"]}</span></StatPill>
                <StatPill>+ {treasure} treasure</StatPill>
                <StatPill>+ {experience} experience</StatPill>
            </div>
        </Modal>
    )
}