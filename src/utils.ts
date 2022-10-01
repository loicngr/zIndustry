import {APP_DEBUG} from "./consts";

export function devLog(message: string): void {
    if (!APP_DEBUG)
        return

    console.log(`> ${message}`)
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}
