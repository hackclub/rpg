'use client'
import { Tooltip } from 'react-tooltip'
import { Item } from '@prisma/client';
import useSWR from 'swr';
import Button from '@/components/common/Button';
import { fetcher, multiFetcher } from '@/lib/fetch';
import { FormEvent } from 'react';

export default function Items(){
    const { data, error, isLoading, mutate } = useSWR(["/api/inventory/status?query=all", "/api/battle/status?query=currently"], multiFetcher)
    if (isLoading){
        return <div>Loading</div>
    }

    let items: Item[] = []
    let inBattleStatus = null

    if (data){
        items = (data as any)[0]["inventory"]
        inBattleStatus = (data as any)[1]["battling"]
    }

    return (
        <div className = "grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] justify-between py-4 gap-y-16 gap-16 flex-wrap">
            {items.map((item: Item, index: number) => (
                <div key = {index} className = "">
                    <Tooltip id={item.name} className = "z-20"/>
                    <div className = "bg-gray-300 border-2 p-1 col-span-1" data-tooltip-id={item.name} data-tooltip-content={item.desc + " " + item.multiplier + "x multiplier. " + "✩".repeat(item.rarity)}>
                        <img alt={`${item.name} image`} className = "size-full" src = {item.image}/>
                    </div>
                    
                    <div className = "my-2">
                        <div className = "text-center overflow-auto bg-gray-700 text-xs md:text-sm p-2">{item.name}</div>
                        
                        { inBattleStatus 
                            ? <span>
                                <Tooltip id={String(item.id)+"_disabled"}/>
                                <span data-tooltip-id={String(item.id)+"_disabled"} data-tooltip-content="Can't equip weapons while in battle.">
                                    <Button className = "mx-auto text-xs" disabled={true}>IN BATTLE</Button>
                                </span>
                             </span>
                            : item.userEquipped 
                                ? <Button className = "mx-auto text-xs" disabled={true}>EQUIPPED</Button>
                                : <Button form="_unused" onClickAction={ async (event: FormEvent<HTMLInputElement>) => {

                                    await fetch("/api/inventory", {
                                            method: "POST", 
                                            body: JSON.stringify({name: item.name})}); 
                                            mutate()}}>EQUIP</Button>
                            }
                    </div>
                </div>
            ))}
        </div>
    )
}