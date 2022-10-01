import {TComponent} from "./types";

export interface IComponent {
    [key: number]: TComponent
}

export interface IKeys {
    [key: string]: boolean
}