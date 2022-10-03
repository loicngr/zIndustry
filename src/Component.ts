import {APP_MAP} from "./consts"
import {TMap} from "./types"

export class Component {
    public map: TMap
    public screenX: number
    public screenY: number
    public width: number
    public height: number
    public x: number
    public y: number
    public speed: number
    public image: HTMLImageElement | null

    constructor(map: TMap, x: number, y: number) {
        this.map = map

        this.x = x
        this.y = y

        this.screenX = 0
        this.screenY = 0

        this.speed = 256 // pixels per second

        this.width = APP_MAP.tSize
        this.height = APP_MAP.tSize

        this.image = null
    }
}