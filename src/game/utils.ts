import { APP_DEBUG } from '../common/consts'

export function devLog(message: string): void {
  if (!APP_DEBUG) return

  console.log(`> ${message}`)
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

// Simple count number of time we have "a" in "b"
export const numberInNumber = (a: number, b: number): number => {
  let cpt = 0
  let newA = a

  while (newA > b) {
    newA -= b
    ++cpt
  }

  return cpt
}

/**
 * Force type cast
 */
export function forceCast<T>(i: unknown): T {
  return <T>(<unknown>i)
}
