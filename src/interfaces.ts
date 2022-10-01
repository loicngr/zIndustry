import {TComponent, TPosition} from "./types";

export interface IComponent {
    [key: number]: TComponent
}

export interface IKeys {
    [key: string]: boolean
}

export interface ITileData {
    [key: string]: TPosition
}
