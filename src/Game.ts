import {Loader} from "./Loader"
import {APP_DEBUG, APP_MAP, APP_MAP_SIZE, APP_TILE_ANIMATION, APP_TILE_CHARACTER_1_DATA} from "./consts"
import {Keyboard} from "./Keyboard"
import {EKey} from "./enums"
import {Camera} from "./Camera"
import {Character} from "./Character"
import {ICharacter, IGame} from "./interfaces"
import {TMap, TPosition, TTileAnimation} from "./types"
import {devLog, numberInNumber} from "./utils"

export class Game implements IGame {
    readonly context: CanvasRenderingContext2D
    previousElapsed: number
    readonly loader: Loader
    readonly keyboard: Keyboard
    camera: undefined | Camera
    character: undefined | ICharacter
    readonly map: TMap
    tileAtlas: HTMLImageElement | null
    shouldDrawGrid: boolean
    tileAnimation: TTileAnimation

    constructor(context: CanvasRenderingContext2D) {
        this.context = context
        this.previousElapsed = 0
        this.tileAtlas = null

        this.loader = new Loader()
        this.keyboard = new Keyboard()
        this.map = APP_MAP
        this.shouldDrawGrid = APP_DEBUG
        this.tileAnimation = APP_TILE_ANIMATION
    }

    run(): void {
        Promise.all(this.load())
            .then(() => {
                this.init()
                requestAnimationFrame(this.tick.bind(this))
            })
    }

    load(): Promise<HTMLImageElement | string>[] {
        return [
            this.loader.loadImage('tiles', './tiles/tiles.png'),
            this.loader.loadImage(APP_TILE_CHARACTER_1_DATA.key, `./tiles/${APP_TILE_CHARACTER_1_DATA.key}.png`)
        ]
    }

    tick(elapsed: number): void {
        requestAnimationFrame(this.tick.bind(this))
        const _APP_MAP_SIZE = APP_MAP_SIZE()

        this.context.clearRect(0, 0, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
        const elapsedDelta = elapsed - this.previousElapsed
        const delta = Math.min((elapsedDelta) / 1000.0, 0.25)

        this.previousElapsed = elapsed
        this.update(delta)
        this.render(delta)
    }

    init(): void {
        const keysValues = Object.values(EKey)
        this.keyboard.listenForEvents(keysValues)

        this.tileAtlas = this.loader.getImage('tiles')
        this.character = new Character(this.loader, this.map, 160, 160, APP_TILE_CHARACTER_1_DATA)

        const _APP_MAP_SIZE = APP_MAP_SIZE()

        this.camera = new Camera(this.map, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
        this.camera.follow(this.character)
    }

    update(delta: number): void {
        if (!this.character || !this.camera) {
            return
        }

        this.character.handleMovement(this, delta)

        if (this.keyboard.isPressed(EKey.F1)) {
            this.keyboard.resetKey(EKey.F1)

            this.shouldDrawGrid = !this.shouldDrawGrid
        }

        if (this.keyboard.isPressed(EKey.F)) {
            this.keyboard.resetKey(EKey.F)

            devLog(`x: ${this.character.x}, y: ${this.character.y}`)
            devLog(`screenX: ${this.character.screenX}, screenY: ${this.character.screenY}`)
        }

        if (this.keyboard.isPressed(EKey.E) && this.character) {
            this.keyboard.resetKey(EKey.E)

            this.spawnItem(0, this.character.predictNextPositionTile(), 8)
        }

        this.camera.update()
    }

    spawnItem(layerIndex: number, position: TPosition, tile: number): void {
        const col = this.map.getCol(position.x)
        const row = this.map.getRow(position.y)

        if (this.map.isSolidTileAtRowCol(col, row)) {
            return
        }

        this.map.setTile(layerIndex, col, row, tile)
    }

    render(delta: number): void {
        // background
        this.drawLayer(0, delta)


        if (this.character && this.character.image && this.character.tileData) {
            let characterTile: number = this.character.tileData.tiles[this.character.direction]

            this.context.drawImage(
                this.character.image,
                (characterTile - 1) * this.character.tileData.tSize,
                0,
                this.character.tileData.tSize,
                this.character.tileData.tSize,
                this.character.screenX - this.character.width / 2,
                this.character.screenY - this.character.height / 2,
                this.character.tileData.tSize,
                this.character.tileData.tSize
            )
        }

        // top
        this.drawLayer(1, delta)

        if (this.shouldDrawGrid)
            this.drawGrid()
    }

    drawLayer(layerIndex: number, _delta: number): void {
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
                let tile: number = this.map.getTile(layerIndex, c, r)

                const x = (c - startCol) * this.map.tSize + offsetX
                const y = (r - startRow) * this.map.tSize + offsetY

                if (tile in this.tileAnimation) {
                    const deltaLastTick = this.previousElapsed - this.tileAnimation[tile].lastTick
                    if (deltaLastTick > this.tileAnimation[tile].tick) {
                        this.tileAnimation[tile].state += 1

                        if (this.tileAnimation[tile].state >= this.tileAnimation[tile].tiles.length) {
                            this.tileAnimation[tile].state = 0
                        }

                        this.tileAnimation[tile].lastTick = this.previousElapsed
                    }

                    tile = this.tileAnimation[tile].tiles[this.tileAnimation[tile].state]
                }

                this.context.drawImage(
                    this.tileAtlas,
                    ((tile - 1) % this.map.tileData.col) * this.map.tSize,
                    numberInNumber(tile, this.map.tileData.col) * this.map.tSize,
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

    drawGrid(): void {
        if (!this.camera) {
            return
        }

        const width = this.map.cols * this.map.tSize
        const height = this.map.rows * this.map.tSize

        let x
        let y

        const mapRows = this.map.rows
        const mapCols = this.map.cols

        const _common = (x: number, y: number, lineToX: number, lineToY: number) => {
            this.context.beginPath()
            this.context.moveTo(x, y)
            this.context.lineTo(lineToX, lineToY)
            this.context.stroke()
        }

        for (let r = 0; r < mapRows; ++r) {
            x = -this.camera.x
            y = r * this.map.tSize - this.camera.y

            _common(x, y, width, y)
        }

        for (let c = 0; c < mapCols; ++c) {
            x = c * this.map.tSize - this.camera.x
            y = -this.camera.y

            _common(x, y, x, height)
        }
    }
}