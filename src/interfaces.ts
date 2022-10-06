import {EDirection} from "./enums"
import {TMap, TPosition} from "./types"
import {Loader} from "./Loader";
import {Keyboard} from "./Keyboard";
import {Camera} from "./Camera";

export interface IGame {
    readonly context: CanvasRenderingContext2D
    previousElapsed: number
    readonly loader: Loader
    readonly keyboard: Keyboard
    camera: undefined | Camera
    character: undefined | ICharacter
    readonly map: TMap
    tileAtlas: HTMLImageElement | null

    run(): void

    load(): Promise<HTMLImageElement | string>[]

    tick(elapsed: number): void

    init(): void

    update(delta: number): void

    spawnItem(layerIndex: number, position: TPosition, tile: number): void

    render(delta: number): void

    drawLayer(index: number, delta: number): void

    drawGrid(): void
}

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

    handleMovement(game: IGame, updateDelta: number): void

    predictNextPosition(position?: TPosition): TPosition

    predictNextPositionTile(position?: TPosition): TPosition
}