import { Loader } from '../Loader'
import { Keyboard } from '../Keyboard'
import { Camera } from '../Camera'
import { Map } from '../Map'
import { TPosition } from '../types/common'
import { ICharacter } from './character'
import { TTileAnimation } from '../types/tileAnimation'
import { TFloatingText } from '../../common/types'

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
  readonly floatingTexts: TFloatingText[]

  run(): void

  load(): Promise<HTMLImageElement | string>[]

  tick(elapsed: number): void

  init(): void

  update(delta: number): void

  spawnItem(layerIndex: number, position: TPosition, tile: number): void

  render(delta: number): void

  addFloatingText(item: Omit<TFloatingText, 'id'>): void

  removeFloatingText(id: number): void

  updateFloatingText(id: number, item: Partial<TFloatingText>): void

  handleUpdateKeyActionBarUnSelected(): void

  handleUpdateKeyActionBarSelected(): void

  handleActionBarKeys(): void

  drawContextDraw(tile: HTMLImageElement, sx: number, sy: number, x: number, y: number, tileSize: number): void

  drawComputeSxSy(tile: number): { sx: number; sy: number }

  drawComputeBasics(): {
    startCol: number
    endCol: number
    startRow: number
    endRow: number
    offsetX: number
    offsetY: number
  }

  drawTileOverlay(): void

  drawLayer(index: number, delta: number): void

  drawGrid(): void
}
