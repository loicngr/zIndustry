import {EDirection} from "./enums"
import {TPosition} from "./types";

export interface ICharacter {
    image: HTMLImageElement | null;
    height: number;
    width: number;
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    direction: EDirection

    move(delta: number, x: number, y: number): void;

    getFrontPosition(): TPosition;
}