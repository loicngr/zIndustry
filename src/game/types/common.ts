export type TKeyboard = { [key: string]: boolean }

export type TPosition = { x: number, y: number }

export type TLoader = { [key: string]: HTMLImageElement | any }

export type TJson = CallableFunction | number[][] | number[] | string | number | any | { [key: string]: TJson }