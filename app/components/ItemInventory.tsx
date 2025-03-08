'use client'
import { Tooltip } from 'react-tooltip'
import { Item } from "@/types";

export default function Items({items}: {items: Item[]}){
    return (
        <>
        {items.map((item: Item, index) => (
            <div key = {index} className = "size-24 md:size-30">
                <Tooltip id={item.name} className = "z-20"/>
                <div className = "bg-gray-300 border-2 p-1 col-span-1" data-tooltip-id={item.name} data-tooltip-content={item.desc + " " + "✩".repeat(item.rarity)}>
                    <img className = "size-full" src = {item.image}/>
                </div>
                <div className = "my-2 text-center overflow-auto bg-gray-700 text-xs md:text-sm p-2">{item.name}</div>
            </div>
        ))}
        </>
    )
}