import {APP_DEBUG} from "./consts"

export function devLog(message: string): void {
    if (!APP_DEBUG)
        return

    console.log(`> ${message}`)
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
}

// todo: O(3)
// Simple count number of time we have "a" in "b"
export const numberInNumber = (a: number, b: number): number => {
    let cpt = 0
    let newA = a
    while (true) {
        if (cpt === 0 && a <= b || newA < b) {
            return cpt
        }

        newA -= b
        ++cpt
    }
}

/**
 * Force type cast
 */
export function forceCast<T>(i: any): T {
    return <T>(<unknown>i)
}