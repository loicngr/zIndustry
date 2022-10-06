export type TMap = CallableFunction | number[][] | number[] | string | number | any | { [key: string]: TMap }

export type TLoader = { [key: string]: HTMLImageElement }

export type TKeyboard = { [key: string]: boolean }

export type TPosition = { x: number, y: number }

export type TTileAnimation = {
    [key: number]: {
        tiles: number[]
        lastTick: number
        tick: number
        state: number
    }
}