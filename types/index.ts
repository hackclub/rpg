export type Item = {
    id?: number,
    user?: string,
    userId?: string,
    name: string,
    desc: string,
    image: string,
    rarity: number,
    multiplier: number,
}

export type Boss = {
    id?: number,
    name: string,
    image: string,
    desc: string,
    strength: string,
    weakness: string,
    health: number,
    maxHealth: number
    active: boolean
}

export type Project = {
    created_at: string,
    human_readable_last_heartbeat_at: string,
    id: string,
    last_heartbeat_at: string,
    name: string,
    urlencoded_name: string
}