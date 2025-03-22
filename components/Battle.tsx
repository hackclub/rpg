'use client'
import Button from "@/components/common/Button"
import Modal from "@/components/common/Modal"
import StatPill from "@/components/common/StatPill"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { multiFetcher } from "@/lib/fetch"
import { determineDamage, determineTreasure, determineExperience, determineTimeSpentPaused } from "@/lib/stats";
import Items from "./ItemInventory"
import { Battle } from "@prisma/client"
import { useSession } from "next-auth/react"
import Form from 'next/form';
import { FormEvent } from "react"
import { Tooltip } from "react-tooltip"

const battleCompleteFlavourText = [
    "You arrive at your campsite, victorious, and take stock of what you've taken from $BOSSNAME.",
]

export default function BattleButton(){
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isFinishedOpen, setIsFinishedOpen ] = useState(false)
    const [ isCancelOpen, setIsCancelOpen ] = useState(false)
    const [ weaponMultiplier, setWeaponMultiplier ] = useState(1)
    const [ selectedProject, setSelectedProject ] = useState("")
    const [ customProject, setCustomProject ] = useState("")
    const [ projectType, setProjectType ] = useState("")
    const [ projectEffect, setProjectEffect ] = useState("")
    const session = useSession()

    const urls = [
        "/api/battle/status?query=currently", 
        "/api/battle/status?query=latest", 
        "/api/boss/status?query=all", 
        "/api/project/status"
    ]
    const { data, error, isLoading, mutate } = useSWR(urls, multiFetcher, {
        refreshInterval: 250,
        onSuccess: (data) => {
          setProjectEffect(data[1] ? data[1]["effect"] : "")
          setProjectType(data[1] ? data[1]["project"]["type"] : projectType)
          setWeaponMultiplier(data[1] ? data[1]["multiplier"] : weaponMultiplier)
        },

    })

    let isBattling, isPaused

    useEffect(() => {
        if (data){
          setProjectEffect(data[1] ? data[1]["effect"] : "")
          setProjectType(data[1] ? data[1]["project"]["type"]: projectType)
          setWeaponMultiplier(data[1] ? data[1]["multiplier"] : weaponMultiplier)
        }
      }, [data, projectType, weaponMultiplier])

    let projects, newProjectEffect: string, newProjectType: string, mostRecentBoss

    
    if (data){
        isBattling = data[0]["battling"]
        isPaused = data[0]["paused"]
        projects = data[3]

        projects = Array.from(
            new Map(projects.map((item: any)=> [item.name, item])).values()
          );    }

    function clearStates(){
        setSelectedProject("")
        setCustomProject("")
    }

    async function handleBattleStart(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedProject = String(formData.get("project"))
        const customProject = String(formData.get("customProject"))
        const projectType = String(formData.get("type"))
        newProjectType = projectType
        
        const getCurrentEquippedWeapon = (await fetch("/api/inventory/status?query=equipped", {cache: "no-store"}).then(r=> r.json()))[0]
        const getBossStats = (await fetch("/api/boss/status").then(r => r.json()))

        let multiplier

        if (!getCurrentEquippedWeapon){
            multiplier = 1
        } else {
            multiplier = getCurrentEquippedWeapon["multiplier"]
        }

        
        if (getBossStats["weakness"] == projectType){
            multiplier *= 2
            newProjectEffect = "weakness"
            setProjectEffect("weakness")

        } else if (getBossStats["strength"] == projectType){
            multiplier /= 2
            newProjectEffect = "strength"
            setProjectEffect("strength")
        } else {
            setProjectEffect("")
        }

        const projectToDB = selectedProject !== "_other" ? selectedProject.replace(/[<>\"'`;(){}[\]=]/g, '') : customProject.replace(/[<>\"'`;(){}[\]=]/g, '')
        const createProject = await fetch("/api/project", {
                method: "POST",
                body: JSON.stringify(
                    {
                        "name": projectToDB,
                        "projectType": projectType,
                    }
                )
            }
        )
        const r = await fetch("/api/battle/start", { 
            method: "POST", 
            body: JSON.stringify(
                {
                    "projectName": projectToDB,
                    "projectType": projectType,
                    "effect": newProjectEffect as string,
                }) 
            }); 
        setIsOpen(false); 
        setWeaponMultiplier(multiplier)
        setProjectType(projectType)
        clearStates();
    }

    const acceptBattleRewards = async function(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await fetch("/api/battle/end", { method: "POST", body: JSON.stringify({projectType: projectType})});
        const url = String(formData.get("url"))
        const codeUrl = String(formData.get("codeUrl"))
        const description = String(formData.get("description")).replace(/[<>\"'`;(){}[\]=]/g, '')
        const r = await fetch("/api/battle/scraps", {
            method: "POST",
            body: JSON.stringify({
                url: url,
                description: description,
                codeUrl: codeUrl
            })
        })
        setProjectEffect("")
        setProjectType("")
        setIsFinishedOpen(false)
        mutate(); 

    }

    return (
        <>
        <div>
            { isLoading 
                ? <Button>Loading...</Button>
                : isBattling && isPaused
                    ? <Button className = "mx-auto w-max" onClickAction={async () => { await fetch("/api/battle/resume", { method: "PUT" }); mutate()}}>UNPAUSE BATTLE</Button>
                    : isBattling && !isPaused 
                        ? <>
                            <Button className = "mx-auto w-max" onClickAction={async () => { setIsFinishedOpen(true); mutate()}}>END CURRENT BATTLE</Button>
                            
                            <div className = "flex flex-col md:flex-row *:text-xs"> 
                                <Button className = "mx-auto w-max" onClickAction={async () => { await fetch("/api/battle/pause", { method: "PUT" }); mutate()}}>PAUSE BATTLE</Button>
                                <Button className = "mx-auto w-max" onClickAction={async () => { setIsCancelOpen(true); mutate()}}>CANCEL BATTLE</Button>
                            </div>
                            </>
                        :  <Button className = "mx-auto w-max" onClickAction={async () => { setIsOpen(true); mutate()}}> START BATTLE </Button>

            }
        </div>
        {/* start session modal */}
         <Modal isOpen={isOpen} setIsOpen={setIsOpen} customCloseAction={clearStates}>
            <h1 className = "text-2xl md:text-5xl py-4">Start adventuring</h1>
            <div className = "text-base sm:max-lg:text-sm grid-cols-1 lg:grid-cols-2">
            <Form id="battleStats" className = "lg:grid lg:grid-cols-2 gap-8" action="javascript:void(0);" onSubmit={(e) => { mutate(); handleBattleStart(e) }}>
                <div className = "col-span-1 flex flex-col gap-2">
                        <div className = "flex flex-col gap-2">
                            <label htmlFor="project" className = "font-bold text-accent">What project are you working on?</label>
                            <select required className="flex flex-col gap-1 *:bg-darker *:text-white" name = "project" id="project" defaultValue="_select" form="battleStats" onChange={(e) => {setSelectedProject(e.target.value)}}>
                                <option disabled value = "_select">[Select a project]</option> 
                                {projects && projects.map((project: any, index: number) => /* i really cbf to fix the type rn */
                                    <option key={index} value = {project.name}>{project.name}</option>
                                )}
                                <option value="_other">[Other project not listed here]</option>
                            </select>
                        </div>
                        { selectedProject === "_other" 
                            ?  <div className = "flex flex-col gap-1"><label className = "font-bold text-accent block">Enter project name: </label> <input form="battleStats" onChange={(e) => {setCustomProject(e.target.value)}} required name="customProject" type = "text" id="customProject"></input></div>
                            : null }

                        <div className = "flex flex-col gap-2">
                        <label htmlFor="type" className = "font-bold text-accent">What type of project is it?</label>
                            <select form="battleStats" className="flex flex-col gap-1 *:bg-darker *:text-white" name = "type" id="type" defaultValue="_select" onChange={(e) => {setProjectType(e.target.value)}} required>
                                <option disabled value = "_select">[Select a type]</option> 
                                <option key="game" value = "Game development">Game development</option>
                                <option key="web" value = "Web development">Web development</option>
                                <option key="app" value = "App development">App development</option>
                                <option key="cli" value = "CLI development">CLI development</option>
                                <option key="ai" value = "AI/ML development">AI/ML development</option>
                                <option key="data" value = "Data science">Data science</option>
                                <option key="hardware" value = "Hardware">Hardware</option>
                                <option key="other" value = "_other">[Other type not listed here]</option>
                            </select>
                        </div>
                        </div>
                        <div className = "col-span-1">
                        <p className = "font-bold text-accent">Equip a weapon:</p>
                            <Items/>
                        </div>
                        <div className = "col-span-2">
                            <Button type="submit" shouldPreventDefault={false} className = "w-max mx-auto" onClickAction={async () => {mutate()}}>CLICK TO START</Button>
                        </div>
                    </Form>
                </div>
         </Modal>

         {/* finish session modal */}
         { data && data[1] && <SuccessModal states={{isFinishedOpen, setIsFinishedOpen, projectType, setProjectType, projectEffect, setProjectEffect}} data={data[1]} closeAction={acceptBattleRewards} weaponMultiplier={weaponMultiplier}/> }
        <ConfirmCancelModal isCancelOpen={isCancelOpen} setIsCancelOpen={setIsCancelOpen}/>
        </>
    )
}


interface States {
    isFinishedOpen: boolean,
    setIsFinishedOpen: (value: any) => void,
    projectType: string,
    setProjectType: (value: any) => void,
    projectEffect: string,
    setProjectEffect: (value: any) => void
}

function SuccessModal({states, closeAction, data, weaponMultiplier}: {states: States, closeAction: any, weaponMultiplier: number, data: Battle}){
    const timeSpentPaused = (determineTimeSpentPaused(data["timesPaused"], data["timesUnpaused"])).reduce((pSum, a) => pSum + a, 0)
    const duration = (Date.now() - new Date(data["createdAt"]).getTime())/1000 - timeSpentPaused
    const damage = determineDamage(duration, weaponMultiplier)
    const treasure = determineTreasure(duration, weaponMultiplier)
    const experience = determineExperience(duration, weaponMultiplier)
    const bossAssociatedWithSession = (data as any)["boss"]
    
    return (
        <Modal isOpen={states.isFinishedOpen} setIsOpen={states.setIsFinishedOpen} showClose={true}>
            <h1 className = "text-3xl md:text-5xl py-4 align-middle">
            <svg xmlns="http://www.w3.org/2000/svg" className = "inline size-6 md:size-12 mr-2 md:mr-4" fill="#fff" viewBox="0 0 256 256"><path d="M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z"></path></svg>
                Battle Summary
            </h1>
                { battleCompleteFlavourText[Math.floor(Math.random() * battleCompleteFlavourText.length)].replace("$BOSSNAME", bossAssociatedWithSession["name"]) } <span className = "text-accent font-bold">Boss HP: {bossAssociatedWithSession.health}</span>
                <p>You spent {(duration/3600).toFixed(2) + " hours (" + (duration/60).toFixed(2) + " minutes)"} battling! You spent {(timeSpentPaused/60).toFixed(2)} minutes paused.</p>
            <div className = "flex flex-col">
            <div className = "pt-3">
                <div className = "flex flex-row flex-wrap gap-4 items-center justify-center sm:items-start">
                    <div className = "flex flex-col gap-2">
                        <StatPill>
                            <Tooltip id = "effect"/>
                            {damage} damage done! 
                            { states.projectEffect == "strength" 
                                    ? <span className = "text-accent font-bold" data-tooltip-id="effect" data-tooltip-content={states.projectType + " projects do half damage :("}>This attack was weak...</span>
                                    : states.projectEffect == "weakness"
                                        ? <span className = "text-accent font-bold" data-tooltip-id="effect" data-tooltip-content={states.projectType + " projects do double damage!"}>This attack was very effective!</span>
                                        : null
                            }
                        </StatPill>
                        </div>
                    <StatPill>+ {treasure} treasure</StatPill>
                    <StatPill>+ {experience} experience</StatPill>
                </div>
            </div>

            <div>
            <h2>Upload Scraps</h2>
                <Form id="scrapsSubmit" action="javascript:void(0);" onSubmit={(e) => {closeAction(e)}}>
                        <span className = "flex flex-col gap-4">
                        <label className = "font-bold text-accent block">What did you do this battle?</label> 
                        <textarea placeholder="Something like 'I improved the UI of the form elements and fixed a bug that was stopping things from uploading.'" className = "resize-y" required form="scrapsSubmit" name="description" id="description"></textarea>
                        
                        <span className = "grid md:grid-cols-2 gap-4">
                            <span className = "col-span-1 flex flex-col gap-2">
                                <label className = "font-bold text-accent block">What did you work on? Upload some <a target="_blank" className="link text-white" href = "https://app.slack.com/client/T0266FRGM/C016DEDUL87">(image or video)</a> proof!</label> 
                                <input type="url" placeholder="https://hc-cdn.hel1.your-objectstorage.com/..." required form="scrapsSubmit" name="url" id="url"></input>
                            </span>

                            <span className = "col-span-1 flex flex-col gap-2">
                                <Tooltip id = "commit"/>
                                <label data-tooltip-id="commit" data-tooltip-content="If you programmed during this battle, put the link to your commit here (or just use this as a second place to submit proof!)" className = "font-bold text-accent">Coded? Share your commit link here!</label> 
                                <input type="url" placeholder="https://github.com/..." form="scrapsSubmit" name="codeUrl" id="codeUrl"></input>
                            </span>

                        </span>

                    </span>
                    <Button type="submit" shouldPreventDefault={false} className = "w-max mx-auto">CLAIM REWARDS</Button>
                </Form>
            </div>
            </div>

        </Modal>
    )
}

function ConfirmCancelModal({isCancelOpen, setIsCancelOpen}: {isCancelOpen: boolean, setIsCancelOpen: (value: any) => void}){
    return (
        <Modal isOpen={isCancelOpen} setIsOpen={setIsCancelOpen}>
            <div className = "flex flex-col h-full">
                <h1 className = "text-3xl md:text-5xl py-4 align-middle">
                <svg xmlns="http://www.w3.org/2000/svg" className = "inline size-6 md:size-12 mr-2 md:mr-4" fill="#fff" viewBox="0 0 256 256"><path d="M216,32H152a8,8,0,0,0-6.34,3.12l-64,83.21L72,108.69a16,16,0,0,0-22.64,0l-12.69,12.7a16,16,0,0,0,0,22.63l20,20-28,28a16,16,0,0,0,0,22.63l12.69,12.68a16,16,0,0,0,22.62,0l28-28,20,20a16,16,0,0,0,22.64,0l12.69-12.7a16,16,0,0,0,0-22.63l-9.64-9.64,83.21-64A8,8,0,0,0,224,104V40A8,8,0,0,0,216,32ZM52.69,216,40,203.32l28-28L80.68,188Zm70.61-8L48,132.71,60.7,120,136,195.31ZM208,100.06l-81.74,62.88L115.32,152l50.34-50.34a8,8,0,0,0-11.32-11.31L104,140.68,93.07,129.74,155.94,48H208Z"></path></svg>
                    Cancel Battle
                </h1>
                <div className = "self-center items-center justify-center grow  gap-2 flex flex-col h-full">
                    <p className = "text-2xl">Are you sure you want to cancel this battle?</p>
                    <p>This battle will not be saved. You <span className = "text-accent">will not</span> gain any treasure or experience, or do any damage to the current boss.</p>
                    <p>If you wanted to end the battle and submit your scraps, click <span className = "text-accent">Close</span>, then click <span className = "text-accent">End Current Battle</span>.</p>
                </div>
                <Button type="submit" className = "w-max mx-auto grow" onClickAction={async () => {await fetch("/api/battle/cancel", { method: "PUT"}); setIsCancelOpen(false)} }>CANCEL BATTLE</Button>

            </div>
        </Modal>
    )
}