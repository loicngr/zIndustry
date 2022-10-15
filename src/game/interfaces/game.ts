import { Loader } from '../Loader'
import { Keyboard } from '../Keyboard'
import { Camera } from '../Camera'
import { Map } from '../Map'
import { TPosition } from '../types/common'
import { ICharacter } from './character'
import { TTileAnimation } from '../types/tileAnimation'
import { FloatingText } from '../FloatingText'
import { Ui } from '../Ui'
import { Render } from '../Render'

export interface IGame {
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

  run(): Promise<boolean>
  load(): Promise<HTMLImageElement | string>[]
  init(): void
  tick(elapsed: number): void
  handleUpdateKeyActionBarUnSelected(): void
  handleUpdateKeyActionBarSelected(): void
  handleActionBarKeys(): void
  update(delta: number): void
  spawnItem(layerIndex: number, position: TPosition, tile: number): boolean
}
