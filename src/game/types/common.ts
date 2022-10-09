import { EDirection } from '../enums/direction'

export type TKeyboard = Record<string, boolean>

export type TPosition = { x: number; y: number }

export type TLoader = Record<string, HTMLImageElement | unknown>

export type TJson = CallableFunction | number[][] | number[] | string | number | { [key: string]: TJson }

export type TTileData = {
  key: string
  tSize: number
  tiles: Record<EDirection, number>
}
