export interface ICharacter {
    image: HTMLImageElement | null;
    height: number;
    width: number;
    x: number,
    y: number,
    screenX: number,
    screenY: number

    move(delta: number, x: number, y: number): void;
}