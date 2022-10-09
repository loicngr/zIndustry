import { EDirection } from '../enums/direction'
import { IGame } from './game'
import { TPosition, TTileData } from '../types/common'

export interface ICharacter {
  tileData: TTileData
  image: HTMLImageElement | null
  height: number
  width: number
  x: number
  y: number
  screenX: number
  screenY: number
  direction: EDirection

  move(delta: number, x: number, y: number): void

  handleMovement(game: IGame, updateDelta: number): void

  predictNextPosition(position?: TPosition): TPosition

  predictNextPositionTile(position?: TPosition): TPosition
}
