import { Loader } from './Loader'
import { APP_TILE_ANIMATION, APP_TILE_CHARACTER_1_DATA } from './consts'
import { Keyboard } from './Keyboard'
import { Camera } from './Camera'
import { Character } from './Character'
import { devLog, forceCast } from './utils'
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
import { FloatingText } from './FloatingText'
import { Render } from './Render'

export class Game implements IGame {
  readonly canvasContext: CanvasRenderingContext2D
  previousElapsed: number
  readonly loader: Loader
  readonly floatingTexts: FloatingText
  readonly keyboard: Keyboard
  readonly ui: Ui
  readonly render: Render
  map: undefined | Map
  camera: undefined | Camera
  character: undefined | ICharacter
  tileAtlas: HTMLImageElement | null
  shouldDrawGrid: boolean
  readonly tileAnimation: TTileAnimation

  constructor(context: CanvasRenderingContext2D, uiHost: ReactiveControllerHost) {
    this.canvasContext = context
    this.previousElapsed = 0
    this.tileAtlas = null

    this.loader = new Loader()
    this.keyboard = new Keyboard()
    this.shouldDrawGrid = false
    this.tileAnimation = APP_TILE_ANIMATION
    this.ui = new Ui(uiHost)
    this.floatingTexts = new FloatingText(this.ui)
    this.render = new Render(this)
  }

  /**
   * - Load all images and files
   * - Launch game loop update
   */
  run(): Promise<boolean> {
    return Promise.all(this.load())
      .then(() => {
        this.init()
        requestAnimationFrame(this.tick.bind(this))
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Load files and images
   */
  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadFile('tileConfig', `./tiles/tiles.json`, true),
      this.loader.loadFile('mapConfig', `./map/map.json`, true),
      this.loader.loadImage('tiles', './tiles/tiles.png'),
      this.loader.loadImage(APP_TILE_CHARACTER_1_DATA.key, `./tiles/${APP_TILE_CHARACTER_1_DATA.key}.png`),
    ]
  }

  /**
   * Init character, camera, keyboard etc..
   */
  init(): void {
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
  }

  /**
   * Game loop
   */
  tick(elapsed: number): void {
    requestAnimationFrame(this.tick.bind(this))
    const _APP_MAP_SIZE = APP_MAP_SIZE()

    this.canvasContext.clearRect(0, 0, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height)
    const elapsedDelta = elapsed - this.previousElapsed
    const delta = Math.min(elapsedDelta / 1000.0, 0.25)

    this.previousElapsed = elapsed
    this.update(delta)
    this.render.render()
  }

  handleUpdateKeyActionBarUnSelected(): void {
    if (!this.map || !this.character) {
      return
    }

    const selectedItem = this.character.actionBarSelectedItem
    if (selectedItem && selectedItem.floatingText !== undefined) {
      this.floatingTexts.remove(selectedItem.floatingText)
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
            selectedItem.floatingText = this.floatingTexts.add({
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
}
