'use client'

import { Tooltip } from "react-tooltip";

export function ActiveUsers({currentAdventurers}: {currentAdventurers: {nickname: string}[]}){
    const count = currentAdventurers.length
    return (
    <>
        <Tooltip className = "max-w-1/2" id="online"/>
        <span><span data-tooltip-id="online" data-tooltip-content={ currentAdventurers.map((adventurer) => adventurer.nickname).join(", ") }>{count} {count == 1 ? " adventurer" : " adventurers" }</span> currently on {count == 1 ? " a quest" : " quests" }!</span>
    </>
    )
}