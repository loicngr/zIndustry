import {Loader} from "./Loader"
import {APP_DEBUG, APP_MAP, APP_MAP_SIZE, APP_TILE_CHARACTER_1_DATA} from "./consts"
import {Keyboard} from "./Keyboard"
import {EKey} from "./enums"
import {Camera} from "./Camera"
import {Character} from "./Character"
import {ICharacter, IGame} from "./interfaces"
import {TMap, TPosition} from "./types"
import {devLog} from "./utils"

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

  constructor(context: CanvasRenderingContext2D) {
    this.context = context
    this.previousElapsed = 0
    this.tileAtlas = null

    this.loader = new Loader()
    this.keyboard = new Keyboard()
    this.map = APP_MAP
    this.shouldDrawGrid = APP_DEBUG
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
      this.loader.loadImage('tiles', './tiles/tiles.png'),
      this.loader.loadImage(APP_TILE_CHARACTER_1_DATA.key, `./tiles/${APP_TILE_CHARACTER_1_DATA.key}.png`)
    ]
  }

  private tick(elapsed: number): void {
    requestAnimationFrame(this.tick.bind(this))
    const _APP_MAP_SIZE = APP_MAP_SIZE()

    this.context.clearRect(0, 0, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
    const delta = Math.min((elapsed - this.previousElapsed) / 1000.0, 0.25)

    this.previousElapsed = elapsed
    this.update(delta)
    this.render()
  }

  private init(): void {
    const keysValues = Object.values(EKey)
    this.keyboard.listenForEvents(keysValues)

    this.tileAtlas = this.loader.getImage('tiles')
    this.character = new Character(this.loader, this.map, 160, 160, APP_TILE_CHARACTER_1_DATA)

    const _APP_MAP_SIZE = APP_MAP_SIZE()

    this.camera = new Camera(this.map, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
    this.camera.follow(this.character)
  }

  private update(delta: number): void {
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

      // this.map._isSolidTileAtXY(this.character.x, this.character.y, this.character.direction)
      this.spawnItem(this.character.getFrontPositionDirection(), 5)
    }

    this.camera.update()
  }

  private spawnItem(position: TPosition, tile: number): void {
    const col = this.map.getCol(position.x)
    const row = this.map.getRow(position.y)

    this.map.setTile(1, col, row, tile)
  }

  private render(): void {
    // background
    this.drawLayer(0)

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
    this.drawLayer(1)

    if (this.shouldDrawGrid)
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