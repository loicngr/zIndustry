import { Loader } from './Loader'
import { APP_TILE_ANIMATION, APP_TILE_CHARACTER_1_DATA } from './consts'
import { Keyboard } from './Keyboard'
import { Camera } from './Camera'
import { Character } from './Character'
import { devLog, forceCast, numberInNumber } from './utils'
import { Map } from './Map'
import { TTileAnimation } from './types/tileAnimation'
import { EKey } from './enums/key'
import { TPosition } from './types/common'
import { IGame } from './interfaces/game'
import { ICharacter } from './interfaces/character'
import { APP_MAP_SIZE, ITEMS_TYPES } from '../common/consts'
import { TMapConfig } from './types/mapConfig'
import { TTileConfig } from './types/tileConfig'
import type { ReactiveControllerHost } from 'lit'
import { Ui } from './Ui'
import { TFloatingText } from '../common/types'

export class Game implements IGame {
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
  readonly floatingTexts: TFloatingText[]
  ui: Ui

  constructor(context: CanvasRenderingContext2D, uiHost: ReactiveControllerHost) {
    this.context = context
    this.previousElapsed = 0
    this.tileAtlas = null
    this.floatingTexts = []

    this.loader = new Loader()
    this.keyboard = new Keyboard()
    this.shouldDrawGrid = false
    this.tileAnimation = APP_TILE_ANIMATION
    this.ui = new Ui(uiHost)
  }

  run(): Promise<boolean> {
    return Promise.all(this.load())
      .then(() => {
        return this.init().then(() => {
          requestAnimationFrame(this.tick.bind(this))
          return true
        })
      })
      .catch(() => {
        return false
      })
  }

  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadFile('tileConfig', `./tiles/tiles.json`, true),
      this.loader.loadFile('mapConfig', `./map/map.json`, true),
      this.loader.loadImage('tiles', './tiles/tiles.png'),
      this.loader.loadImage(APP_TILE_CHARACTER_1_DATA.key, `./tiles/${APP_TILE_CHARACTER_1_DATA.key}.png`),
    ]
  }

  tick(elapsed: number): void {
    requestAnimationFrame(this.tick.bind(this))
    const _APP_MAP_SIZE = APP_MAP_SIZE()

    this.context.clearRect(0, 0, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
    const elapsedDelta = elapsed - this.previousElapsed
    const delta = Math.min(elapsedDelta / 1000.0, 0.25)

    this.previousElapsed = elapsed
    this.update(delta)
    this.render()
  }

  init(): Promise<boolean> {
    return new Promise((resolve) => {
      const tileConfig = forceCast<TTileConfig>(this.loader.getFile('tileConfig'))
      const mapConfig = forceCast<TMapConfig>(this.loader.getFile('mapConfig'))
      this.map = new Map(mapConfig, tileConfig)

      const keysValues = Object.values(EKey)
      this.keyboard.listenForEvents(keysValues)

      this.tileAtlas = this.loader.getImage('tiles')
      this.character = new Character(this.ui, this.loader, this.map, 500, 160, APP_TILE_CHARACTER_1_DATA)

      const _APP_MAP_SIZE = APP_MAP_SIZE()

      this.camera = new Camera(this.map, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
      this.camera.follow(this.character)

      resolve(true)
    })
  }

  addFloatingText(item: Omit<TFloatingText, 'id'>): number {
    const itemId = (this.floatingTexts[this.floatingTexts.length - 1]?.id ?? 0) + 1
    this.floatingTexts.push({ ...item, id: itemId })
    this.ui.update()

    return itemId
  }

  removeFloatingText(id: number): void {
    const index = this.floatingTexts.findIndex((i) => i.id === id)

    if (index !== -1) {
      this.floatingTexts.splice(index, 1)
      this.ui.update()
    }
  }

  updateFloatingText(id: number, item: Partial<TFloatingText>): void {
    const index = this.floatingTexts.findIndex((i) => i.id === id)

    if (index !== -1) {
      this.floatingTexts[index] = {
        ...this.floatingTexts[index],
        ...item,
      }
      this.ui.update()
    }
  }

  handleUpdateKeyActionBarUnSelected(): void {
    if (!this.map || !this.character) {
      return
    }

    const selectedItem = this.character.actionBarSelectedItem
    if (selectedItem && selectedItem.floatingText !== undefined) {
      this.removeFloatingText(selectedItem.floatingText)
      delete selectedItem.floatingText
    }

    this.map.tileOverlay = {}
  }

  handleUpdateKeyActionBarSelected(): void {
    if (!this.map || !this.character) {
      return
    }

    const selectedItem = this.character.actionBarSelectedItem
    if (selectedItem && selectedItem.count > 0 && selectedItem.type) {
      const itemType = ITEMS_TYPES[selectedItem.type]

      if (itemType.canPlace) {
        const { x: characterX, y: characterY } = this.character.predictNextPositionTile()
        const width = this.map.getWidth(characterX)
        const height = this.map.getHeight(characterY)

        if (!this.map.isSolidTileAtRowCol(width, height)) {
          this.map.tileOverlay[itemType.tile] = { x: characterX, y: characterY }

          if (selectedItem.floatingText === undefined) {
            selectedItem.floatingText = this.addFloatingText({
              text: selectedItem.name,
              at: { x: characterX, y: characterY },
            })
          }
        }
      }
    }
  }

  handleActionBarKeys(): void {
    const actionBarKeys: EKey[] = [EKey.Digit1, EKey.Digit2, EKey.Digit3, EKey.Digit4, EKey.Digit5, EKey.Digit6]

    actionBarKeys.forEach((key, _i) => {
      if (!this.character) {
        throw new Error('error')
      }

      const i = _i + 1

      if (this.keyboard.isPressed(key)) {
        this.keyboard.resetKey(key)

        if (this.character.actionBar.size >= i) {
          if (this.character.actionBar.selected === i) {
            this.handleUpdateKeyActionBarUnSelected()
            this.character.updateActionBar({ selected: undefined })
          } else {
            this.character.updateActionBar({ selected: i })
            this.handleUpdateKeyActionBarSelected()
          }
        }
      }
    })
  }

  update(delta: number): void {
    if (!this.character || !this.camera) {
      throw new Error('error')
    }

    this.character.handleMovement(this, delta)

    if (this.keyboard.isPressed(EKey.F1)) {
      this.keyboard.resetKey(EKey.F1)

      this.shouldDrawGrid = !this.shouldDrawGrid
    }

    this.handleActionBarKeys()

    if (this.keyboard.isPressed(EKey.R)) {
      this.keyboard.resetKey(EKey.R)
    }

    if (this.keyboard.isPressed(EKey.F)) {
      this.keyboard.resetKey(EKey.F)

      devLog(`x: ${this.character.x}, y: ${this.character.y}`)
      devLog(`screenX: ${this.character.screenX}, screenY: ${this.character.screenY}`)
    }

    if (this.keyboard.isPressed(EKey.E) && this.character) {
      this.keyboard.resetKey(EKey.E)

      const selectedItem = this.character.actionBarSelectedItem
      if (selectedItem && selectedItem.count > 0 && selectedItem.type) {
        const itemType = ITEMS_TYPES[selectedItem.type]

        if (itemType.canPlace) {
          if (this.spawnItem(1, this.character.predictNextPositionTile(), itemType.tile)) {
            this.character.updateActionBarItem(selectedItem.id, { count: selectedItem.count - 1 })
          }
        }
      }
    }

    this.camera.update()
  }

  spawnItem(layerIndex: number, position: TPosition, tile: number): boolean {
    if (!this.map) {
      return false
    }

    const width = this.map.getWidth(position.x)
    const height = this.map.getHeight(position.y)

    if (this.map.isSolidTileAtRowCol(width, height)) {
      return false
    }

    this.map.setTile(layerIndex, width, height, tile)

    return true
  }

  render(): void {
    // background
    this.drawLayer(1)

    if (this.character && this.character.image && this.character.tileData) {
      const characterTile: number = this.character.tileData.tiles[this.character.direction]

      this.context.drawImage(
        this.character.image,
        (characterTile - 1) * this.character.tileData.tSize,
        0,
        this.character.tileData.tSize,
        this.character.tileData.tSize,
        this.character.screenX - this.character.width / 2,
        this.character.screenY - this.character.height / 2,
        this.character.tileData.tSize,
        this.character.tileData.tSize,
      )
    }

    // top
    this.drawLayer(2)

    this.drawTileOverlay()

    if (this.shouldDrawGrid) this.drawGrid()
  }

  drawLayer(layerIndex: number): void {
    if (!this.tileAtlas || !this.camera || !this.map) {
      throw new Error('error')
    }

    const { startCol, endCol, startRow, endRow, offsetX, offsetY } = this.drawComputeBasics()

    for (let c = startCol; c <= endCol; ++c) {
      for (let r = startRow; r <= endRow; ++r) {
        let tile: number | undefined = this.map.getTile(layerIndex, c, r)

        if (undefined === tile) {
          devLog('Tile not found')
          continue
        }

        const x = (c - startCol) * this.map.mapConfig.tileSize + offsetX
        const y = (r - startRow) * this.map.mapConfig.tileSize + offsetY

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

        const { sx, sy } = this.drawComputeSxSy(tile)
        this.drawContextDraw(this.tileAtlas, sx, sy, x, y, this.map.mapConfig.tileSize)
      }
    }
  }

  drawContextDraw(tile: HTMLImageElement, sx: number, sy: number, x: number, y: number, tileSize: number): void {
    this.context.drawImage(tile, sx, sy, tileSize, tileSize, Math.round(x), Math.round(y), tileSize, tileSize)
  }

  drawComputeSxSy(tile: number): { sx: number; sy: number } {
    if (!this.tileAtlas || !this.camera || !this.map || !this.character) {
      throw new Error('error')
    }

    const sx = ((tile - 1) % this.map.tileConfig.columns) * this.map.mapConfig.tileSize
    const sy = numberInNumber(tile, this.map.tileConfig.columns) * this.map.mapConfig.tileSize

    return { sx, sy }
  }

  drawComputeBasics(): {
    startCol: number
    endCol: number
    startRow: number
    endRow: number
    offsetX: number
    offsetY: number
  } {
    if (!this.camera || !this.map) {
      throw new Error('error')
    }

    const startCol = Math.floor(this.camera.x / this.map.mapConfig.tileSize)
    const endCol = startCol + this.camera.width / this.map.mapConfig.tileSize + 1

    const startRow = Math.floor(this.camera.y / this.map.mapConfig.tileSize)
    const endRow = startRow + this.camera.height / this.map.mapConfig.tileSize + 1

    const offsetX = -this.camera.x + startCol * this.map.mapConfig.tileSize
    const offsetY = -this.camera.y + startRow * this.map.mapConfig.tileSize

    return { startCol, endCol, startRow, endRow, offsetX, offsetY }
  }

  drawTileOverlay(): void {
    if (!this.tileAtlas || !this.camera || !this.map || !this.character) {
      throw new Error('error')
    }

    const { startCol, startRow, offsetX, offsetY } = this.drawComputeBasics()

    for (const strTile in this.map.tileOverlay) {
      const tile = Number(strTile)
      const position = this.map.tileOverlay[tile]
      const r = this.map.getHeight(position.y)
      const c = this.map.getWidth(position.x)

      const x = (c - startCol) * this.map.mapConfig.tileSize + offsetX
      const y = (r - startRow) * this.map.mapConfig.tileSize + offsetY

      const { sx, sy } = this.drawComputeSxSy(tile)
      this.drawContextDraw(this.tileAtlas, sx, sy, x, y, this.map.mapConfig.tileSize)

      const { x: characterX, y: characterY } = this.character.predictNextPositionTile()
      this.map.tileOverlay[tile] = { x: characterX, y: characterY }
    }
  }

  drawGrid(): void {
    if (!this.camera || !this.map) {
      throw new Error('error')
    }

    const width = this.map.mapConfig.width * this.map.mapConfig.tileSize
    const height = this.map.mapConfig.height * this.map.mapConfig.tileSize

    let x
    let y

    const mapRows = this.map.mapConfig.height
    const mapCols = this.map.mapConfig.width

    const baseStrokeStyle = this.context.strokeStyle

    this.context.strokeStyle = '#424242'

    const _common = (x: number, y: number, lineToX: number, lineToY: number) => {
      this.context.beginPath()
      this.context.moveTo(x, y)
      this.context.lineTo(lineToX, lineToY)
      this.context.stroke()
    }

    for (let r = 0; r < mapRows; ++r) {
      x = -this.camera.x
      y = r * this.map.mapConfig.tileSize - this.camera.y

      _common(x, y, width, y)
    }

    for (let c = 0; c < mapCols; ++c) {
      x = c * this.map.mapConfig.tileSize - this.camera.x
      y = -this.camera.y

      _common(x, y, x, height)
    }

    this.context.strokeStyle = baseStrokeStyle
  }
}
