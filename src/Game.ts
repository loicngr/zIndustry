import {Loader} from "./Loader"
import {APP_DEBUG, APP_MAP, APP_MAP_SIZE} from "./consts"
import {Keyboard} from "./Keyboard"
import {EKey} from "./enums"
import {Camera} from "./Camera"
import {Character} from "./Character"
import {ICharacter} from "./interfaces"
import {TMap} from "./types"

export class Game {
    private readonly context: CanvasRenderingContext2D
    private previousElapsed: number
    private readonly loader: Loader
    private readonly keyboard: Keyboard
    private camera: undefined | Camera
    private character: undefined | ICharacter
    private readonly map: TMap
    private tileAtlas: HTMLImageElement | null

    constructor(context: CanvasRenderingContext2D) {
        this.context = context
        this.previousElapsed = 0
        this.tileAtlas = null

        this.loader = new Loader()
        this.keyboard = new Keyboard()
        this.map = APP_MAP
    }

    public run(): void {
        Promise.all(this.load())
            .then(() => {
                this.init()
                requestAnimationFrame(this.tick.bind(this))
            })
    }

    private load(): Promise<HTMLImageElement | string>[] {
        return [
            this.loader.loadImage('tiles', './tilemap/tiles.png'),
            this.loader.loadImage('character', './tilemap/character.png')
        ]
    }

    private tick(elapsed: number): void {
        requestAnimationFrame(this.tick.bind(this))

        this.context.clearRect(0, 0, APP_MAP_SIZE, APP_MAP_SIZE)
        const delta = Math.min((elapsed - this.previousElapsed) / 1000.0, 0.25)

        this.previousElapsed = elapsed
        this.update(delta)
        this.render()
    }

    private init(): void {
        const keysValues = Object.values(EKey)
        this.keyboard.listenForEvents(keysValues)

        this.tileAtlas = this.loader.getImage('tiles')
        this.character = new Character(this.loader, this.map, 160, 160)
        this.camera = new Camera(this.map, APP_MAP_SIZE, APP_MAP_SIZE)
        this.camera.follow(this.character)
    }

    private update(delta: number): void {
        let x = 0
        let y = 0

        if (this.keyboard.isPressed(EKey.Left)) {
            x = -1
        }
        if (this.keyboard.isPressed(EKey.Right)) {
            x = 1
        }
        if (this.keyboard.isPressed(EKey.Up)) {
            y = -1
        }
        if (this.keyboard.isPressed(EKey.Down)) {
            y = 1
        }

        this.character?.move(delta, x, y)
        this.camera?.update()
    }

    private render(): void {
        // background
        this.drawLayer(0)

        if (this.character && this.character.image) {
            this.context.drawImage(
                this.character.image,
                this.character.screenX - this.character.width / 2,
                this.character.screenY - this.character.height / 2
            )
        }

        // top
        this.drawLayer(1)

        if (APP_DEBUG)
            this.drawGrid()
    }

    private drawLayer(layerIndex: number): void {
        if (!this.tileAtlas || !this.camera) {
            return
        }

        const startCol = Math.floor(this.camera.x / this.map.tSize)
        const endCol = startCol + (this.camera.width / this.map.tSize)
        const startRow = Math.floor(this.camera.y / this.map.tSize)
        const endRow = startRow + (this.camera.height / this.map.tSize)
        const offsetX = -this.camera.x + startCol * this.map.tSize
        const offsetY = -this.camera.y + startRow * this.map.tSize

        for (let c = startCol; c <= endCol; ++c) {
            for (let r = startRow; r <= endRow; ++r) {
                const tile = this.map.getTile(layerIndex, c, r)

                if (!tile) {
                    continue
                }

                const x = (c - startCol) * this.map.tSize + offsetX
                const y = (r - startRow) * this.map.tSize + offsetY

                this.context.drawImage(
                    this.tileAtlas,
                    (tile - 1) * this.map.tSize,
                    0,
                    this.map.tSize,
                    this.map.tSize,
                    Math.round(x),
                    Math.round(y),
                    this.map.tSize,
                    this.map.tSize
                )
            }
        }
    }

    private drawGrid(): void {
        if (!this.camera) {
            return
        }

        const width = this.map.cols * this.map.tSize
        const height = this.map.rows * this.map.tSize

        let x
        let y

        for (let r = 0; r < this.map.rows; ++r) {
            x = -this.camera.x
            y = r * this.map.tSize - this.camera.y

            this.context.beginPath()
            this.context.moveTo(x, y)
            this.context.lineTo(width, y)
            this.context.stroke()
        }

        for (let c = 0; c < this.map.cols; ++c) {
            x = c * this.map.tSize - this.camera.x
            y = -this.camera.y

            this.context.beginPath()
            this.context.moveTo(x, y)
            this.context.lineTo(x, height)
            this.context.stroke()
        }
    }
}