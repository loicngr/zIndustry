import {Loader} from "../Loader"
import {Keyboard} from "../Keyboard"
import {Camera} from "../Camera"
import {Map} from "../Map"
import {TPosition} from "../types/common"
import {ICharacter} from "./character"
import {TTileAnimation} from "../types/tileAnimation"

export interface IGame {
    readonly context: CanvasRenderingContext2D
    previousElapsed: number
    readonly loader: Loader
    readonly keyboard: Keyboard
    camera: undefined | Camera
    character: undefined | ICharacter
    tileAtlas: HTMLImageElement | null
    shouldDrawGrid: boolean
    tileAnimation: TTileAnimation
    map: undefined | Map

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