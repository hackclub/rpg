export function determineLevel(xp: number){
    // xp = (level/0.07)**2
    // ln(xp) = 2ln(level/0.07)
    // 0.5(ln(xp)) = ln(level/0.07)
    // xp^(0.5) = level/0.07
    // 0.07xp^(0.5) = level
    return (Math.floor(0.1 * xp**0.5))
}

export function determineDamage(duration: number, multiplier: number){
    console.log(`Battled for ${duration}; weapon multiplier ${multiplier}; damage done ${Math.ceil((duration * multiplier)/60)}`)
    return Math.ceil((duration * multiplier)/60)
}


export function determineTreasure(duration: number, multiplier: number){
    console.log(`Battled for ${duration}; weapon multiplier ${multiplier}; treasure earned ${(duration/6 * 10 * multiplier).toFixed(0)}`)
    return Number((duration/6 * 10 * multiplier).toFixed(0))
}

export function determineExperience(duration: number, multiplier: number){
    console.log(`Battled for ${duration}; weapon multiplier ${multiplier}; experienced earned ${(duration * 10 * multiplier).toFixed(0)}`)
    return Number((duration * 10 * multiplier).toFixed(0))
}