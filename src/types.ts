import {EComponentType, EDirection} from "./enums";

export type TNewComponent = TPosition & {
    width: number,
    height: number,
    type: EComponentType
    tileId: string,
    collision?: boolean,
    canInteract?: boolean
    state?: boolean
}

export type TComponent = TPosition & {
    id?: number,
    width: number,
    height: number,
    speedX?: number,
    speedY?: number,
    state: boolean,
    type: EComponentType,
    collision: boolean,
    tileId: string,
    direction: EDirection,
    interactCondition?: CallableFunction,
    interact?: CallableFunction,
    update: CallableFunction
    move?: CallableFunction
}

export type TPreload = {
    tileMapContext: CanvasRenderingContext2D
}

export type TPosition = {
    x: number,
    y: number
}

export type TSize = {
    width: number,
    height: number
}

export type TTileData = string | number | { [key: string]: TTileData }