import {EComponentType, EDirection} from "./enums";

export type TNewComponent = {
    x: number,
    y: number,
    width: number,
    height: number,
    type: EComponentType
    tileId: string,
    collision?: boolean,
    canInteract?: boolean
    state?: boolean
}

export type TComponent = {
    id?: number,
    x: number,
    y: number,
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