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