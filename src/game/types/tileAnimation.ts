export type TTileAnimation = {
    [key: number]: {
        tiles: number[]
        lastTick: number
        tick: number
        state: number
    }
}