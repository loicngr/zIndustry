export type TKeyboard = Record<string, boolean>

export type TPosition = { x: number, y: number }

export type TLoader = Record<string, HTMLImageElement | unknown>

export type TJson = CallableFunction | number[][] | number[] | string | number | any | { [key: string]: TJson }