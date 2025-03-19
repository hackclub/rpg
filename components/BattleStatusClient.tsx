'use client'

import { Tooltip } from "react-tooltip";
import { User } from "@prisma/client";

export function ActiveUsers({currentAdventurers}: {currentAdventurers: User[]}){
    const count = currentAdventurers.length
    return (
    <>
        <Tooltip className = "max-w-1/2" id="online"/>
        <span><span data-tooltip-id="online" data-tooltip-content={ currentAdventurers.map((adventurer: User) => adventurer.name).join(", ") }>{count} {count == 1 ? " adventurer" : " adventurers" }</span> currently on {count == 1 ? " a quest" : " quests" }!</span>
    </>
    )
}