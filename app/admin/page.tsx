'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { useState, useEffect } from "react";
import Loading from "@/components/common/Loading";
import useSWR from "swr";
import { multiFetcher } from "@/lib/fetch";
import { User, Project, Scrap, Battle} from "@prisma/client";
import GeneralLayout from "../layouts/general";
import Button from "@/components/common/Button";
import { useSWRConfig } from "swr";

// this entire page is really stupid
type RelationsProject = Project & {scrap: Scrap[]; battle: RelationsBattle[]}
type RelationsUser = User & {projects: RelationsProject[]}
type RelationsBattle = Battle & {scrap: Scrap[]; duration: Number}
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
    paused: false,
    projects: [],
    role: "user"}

export default function AdminPanel(){
    const session = useSession();
    const { mutate } = useSWRConfig()


    const [ selectedUser, setSelectedUser ] = useState<RelationsUser>(a);
    const [ query, setQuery ] = useState('')
    const { data, error, isLoading} = useSWR(["/api/admin/users"], multiFetcher)

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
                                <ComboboxOptions anchor="bottom" className="group w-[var(--input-width)] overflow-y-scroll max-h-96 border border-accent bg-dark/50 empty:invisible">
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

                                <div className = "">
                                    { selectedUser && 
                                    <div className = "bg-accent/20 p-5">
                                    <h2 className = "text-6xl"><img src = {selectedUser.image!} className = "size-12 rounded-full inline"/> {selectedUser.nickname}</h2>
                                        <div>{(selectedUser.projects).map((project: RelationsProject, index: number) => 
                                            <div className = "my-5" key={index}>
                                                <p className = "text-accent font-bold">Project {index + 1}:  {project.name} ({project.type})</p>
                                                <p>All Battles</p>
                                                <div className = "py-3 grid lg:grid-cols-2 gap-5">
                                                    {project.battle.map((bat: any, index: number) => (
                                                        <div key = {`battle_${index}`}>
                                                            <span className = "italic font-bold">Battle #{bat.id} -- ({(new Date(bat.createdAt)).toDateString()}) -- ({(bat.duration/3600).toFixed(2)} hours)</span>
                                                            {bat.scrap && bat.scrap.map((scr: Scrap, index: number) => 
                                                                <div key = {index} className = "flex flex-col gap-2 h-full">
                                                                    <span>Scrap #{scr.id}  - <a className = "text-sm" href = {scr.url}>URL</a></span>
                                                                    <img className = "object-cover aspect-3/2" src = {scr.url}/>
                                                                    <div className = "grow flex flex-col">
                                                                        <p className = "inline break-all sm:break-words"><span className = "text-accent">Description:</span> {scr.description}</p>
                                                                        <p className = "inline break-words"><span className = "text-accent">Status:</span> {scr.status}</p>
                                                                    </div>
                                                                    <span className = "sm:flex sm:flex-row py-4"> 
                                                                        <Button onClickAction={async () => { await fetch("/api/admin/scrap?query=reject", { method: "POST", body: JSON.stringify({id: scr.id})}); mut()}}>reject</Button>
                                                                        <Button onClickAction={async () => { await fetch("/api/admin/scrap?query=approve", { method: "POST", body: JSON.stringify({id: scr.id})}); mut()}}>approve</Button>
                                                                    </span>
                                                                </div>   
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}</div>
                                     </div>
                                        }
                                </div>
                            </div>
                        </div>
                    }
            </GeneralLayout>
        )
    }
}