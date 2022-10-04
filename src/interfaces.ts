import {EDirection} from "./enums"
import {TMap, TPosition} from "./types"

export interface ICharacter {
    tileData: TMap;
    image: HTMLImageElement | null
    height: number
    width: number
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    direction: EDirection

    move(delta: number, x: number, y: number): void

    getFrontPositionDirection(): TPosition
}