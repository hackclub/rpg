'use client'
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { useState, useEffect } from "react";
import Loading from "@/components/common/Loading";
import useSWR from "swr";
import { multiFetcher } from "@/lib/fetch";
import { User, Project, Scrap, Battle} from "@prisma/client";
import GeneralLayout from "../layouts/general";
import Button from "@/components/common/Button";
import { useSWRConfig } from "swr";
import Impersonate from "@/components/Impersonate";
import Form from "next/form";
import { FormEvent } from "react";

// this entire page is really stupid
type RelationsProject = Project & {scrap: Scrap[]; battle: RelationsBattle[]}
type RelationsUser = User & {projects: RelationsProject[]}
type RelationsBattle = Battle & {scrap: Scrap[]}
const date = new Date("1970-01-01")

const a: RelationsUser = {
    name: null, 
    id: "", 
    providerAccountId: "",
    email: "", 
    nickname: null, 
    treasure: 0, 
    createdAt: date, 
    updatedAt: date, 
    emailVerified: null, 
    image: null,
    experience: 0,
    battling: false,
    blacklisted: false,
    paused: false,
    projects: [],
    role: "user"}

export default function AdminPanel(){
    const session = useSession();
    const { mutate } = useSWRConfig()
    const [ selectedUser, setSelectedUser ] = useState<RelationsUser>(a);
    const [ query, setQuery ] = useState('')
    const { data, error, isLoading} = useSWR(["/api/admin/users"], multiFetcher)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (data && searchParams) {
            const email = searchParams.get('email')
            const slackId = searchParams.get('slack_id')
            
            if (email) {
                const user = (data[0] as any)["message"].find((user: RelationsUser) => user.email === email)
                if (user) {
                    setSelectedUser(user)
                }
            } else if (slackId) {
                const user = (data[0] as any)["message"].find((user: RelationsUser) => user.providerAccountId === slackId)
                if (user) {
                    setSelectedUser(user)
                }
            }
        }
    }, [data, searchParams])

    if (session.status === "loading"){
        return ( 
            <Loading/>
        )
    }

    if (session.data?.user.role !== "admin"){
        return (
            <div>You should not be here.</div>
        )
    }

    let allUsers
    let filteredUsers: RelationsUser[] = []

    if ((session.data?.user.role === "admin") && session.status === "authenticated"){


    function mut(){
        mutate(
            key => "/api/admin/users", 
            null, 
            { revalidate: true }
        )
    }

    if (data){
            allUsers = (data[0] as any)["message"]
            filteredUsers = query === ''
                    ? allUsers
                    : allUsers!.filter((person: RelationsUser) => {
                        return person.nickname!.toLowerCase().includes(query.toLowerCase())
                    })    
        }
        
        const handleSelect = (user: RelationsUser) => {
            setSelectedUser(user)
        }

        async function updateScrap(e: FormEvent<HTMLFormElement>, battleId: number, scrapId: number, projectId: number, userId: string){
            e.preventDefault()
            const formData = new FormData(e.currentTarget);
            const description = String(formData.get("description"))
            const codeUrl = String(formData.get("codeUrl"))
            const url = String(formData.get("url"))

            const r = await fetch("/api/admin/scrap/create", { method: "POST", body: JSON.stringify({battleId: battleId, scrapId: scrapId, projectId: projectId, description: description, codeUrl: codeUrl, url: url, userId: userId})})
        }
        
        async function updateDuration(e: FormEvent<HTMLFormElement>, battleId: number, ){
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget);
            const duration = String(formData.get("duration"))
            const r = await fetch("/api/admin/battle/edit", { method: "POST", body: JSON.stringify({battleId: battleId, duration: duration})})
        }
        return (
            <GeneralLayout title="Admin Panel">
                    { session?.data?.user.role === "admin" &&
                        <div>                            
                            <div className = "flex flex-col gap-4 w-full">
                                <span className = "font-bold text-accent">Select User</span>
                                <Combobox value={selectedUser} onChange={handleSelect} onClose={() => setQuery('')}>
                                <ComboboxInput
                                    displayValue={(user: RelationsUser) => user?.nickname!}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className = "w-full"
                                />
                                <ComboboxOptions anchor="bottom" className="group w-[var(--input-width)] overflow-y-scroll max-h-96 border-x-1 border-b-1 border-accent bg-darker empty:invisible">
                                    {filteredUsers && filteredUsers!.map((user: RelationsUser) => (
                                    <ComboboxOption key={user.id} value={user} className="p-3 w-full data-[focus]:bg-dark/75">
                                    <span className = "flex flex-row gap-2">
                                        <img src = {user.image!} className = "size-6 rounded-full"/> 
                                        {user.nickname} ({user.name})
                                    </span>
                                    </ComboboxOption> 
                                    ))}
                                </ComboboxOptions>
                                </Combobox>

                                <div>
                                    <div className = {`bg-accent/20 p-5 ${selectedUser.nickname || isLoading ? "block" : "hidden"}`}>
                                    { isLoading && <div>Loading data...</div>}
                                    { selectedUser && selectedUser.nickname && 
                                    <>
                                    <h2 className = "text-6xl"><img src = {selectedUser.image!} className = "size-12 rounded-full inline"/> {selectedUser.nickname} {selectedUser.providerAccountId} <Impersonate user={selectedUser}/></h2>
                                        <div>{(selectedUser.projects).map((project: RelationsProject, index: number) => 
                                            <div className = "my-10" key={index}>
                                                <p className = "text-accent font-bold">Project {index + 1}:  {project.name} ({project.type})</p>
                                                <p>All Battles ({((project.battle).filter((bat) => bat?.scrap?.[0]?.status === "approved"))!.length!}/{project.battle.length} approved)</p>
                                                <div className = "py-3 grid lg:grid-cols-2 gap-5">
                                                    {project.battle.map((bat: any, index: number) => (
                                                        <div key = {`${project.id}_battle_${index}`} className = "my-5 flex flex-col">
                                                            <span className = "italic font-bold">Battle #{bat.id} -- ({(new Date(bat.createdAt)).toDateString()})</span>
                                                            <span className = "block">{bat.damage} damage done to {bat.boss.name}</span>
                                                            <span className = "block">({(bat.duration/3600).toFixed(2)}h / {(bat.duration/60).toFixed(2)}m / {bat.duration}s)</span>
                                                            
                                                            <Form id={`${project.id}_battle_${index}`}  className = "my-2 sm:grid sm:grid-cols-2" action="javascript:void(0);" onSubmit={(e) => updateDuration(e, bat.id)}>
                                                                <input form = {`${project.id}_battle_${index}`} placeholder="seconds" required name="duration" id="duration"/>
                                                                <Button shouldPreventDefault={false} type="submit">UPDATE</Button>
                                                            </Form>
                                                            {bat.scrap && bat.scrap.map((scr: Scrap, index: number) => 
                                                                <div key = {index} className = "grow flex flex-col gap-2 border p-5 my-5 bg-darker/25 rounded-lg">
                                                                    <span>Scrap #{scr.id}  - <a className = "text-sm" href = {scr.url}>URL</a></span>
                                                                    <img className = "object-cover aspect-3/2" src = {scr.url}/>
                                                                    <div className = "grow flex flex-col">
                                                                        <p className = "break-all sm:break-words"><span className = "text-accent">Description:</span> {scr.description}</p>
                                                                        <p className = "inline break-all sm:break-words"><span className = "text-accent">Commit URL:</span> {scr.codeUrl}</p>
                                                                        <p className = "break-words"><span className = "text-accent">Status:</span> {scr.status}</p>
                                                                    </div>
                                                                    <span className = "sm:flex sm:flex-row py-4"> 
                                                                        <Button onClickAction={async () => { await fetch("/api/admin/scrap?query=reject", { method: "POST", body: JSON.stringify({id: scr.id})}); mut()}}>reject</Button>
                                                                        <Button onClickAction={async () => { await fetch("/api/admin/scrap?query=approve", { method: "POST", body: JSON.stringify({id: scr.id})}); mut()}}>approve</Button>
                                                                    </span>
                                                                </div>   
                                                            )}
                                                            <Form id={`${project.id}_battle_${index}_scrap`} className = "flex flex-col items-center justify-center *:w-full" action="javascript:void(0);" onSubmit={(e) => updateScrap(e, bat.id, bat.scrap?.[0]?.id, project.id, selectedUser.id)}>
                                                                <input form ={`${project.id}_battle_${index}_scrap`} placeholder="description" className = "resize-y" required name="description" id="description"/>
                                                                <input form = {`${project.id}_battle_${index}_scrap`} placeholder="url" className = "resize-y" required name="url" id="url"/>
                                                                <input form = {`${project.id}_battle_${index}_scrap`} placeholder="code url" className = "resize-y" required name="codeUrl" id="codeUrl"/>
                                                            <Button shouldPreventDefault={false} type="submit">CREATE/UPDATE SCRAP</Button>
                                                            </Form>
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        )}</div>
                                        </>
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
            </GeneralLayout>
        )
    }
}