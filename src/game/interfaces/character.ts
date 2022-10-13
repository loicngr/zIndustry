import { EDirection } from '../enums/direction'
import { IGame } from './game'
import { TPosition, TTileData } from '../types/common'
import { TActionBar } from '../types/actionBar'
import {TBagItem, TInventory} from '../types/inventory'

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
  inventory: TInventory

  move(delta: number, x: number, y: number): void

  handleMovement(game: IGame, updateDelta: number): void

  predictNextPosition(position?: TPosition): TPosition

  predictNextPositionTile(position?: TPosition): TPosition

  set actionBar(value: TActionBar)

  get actionBar(): TActionBar

  updateActionBarItem(itemId: number, value: Partial<TBagItem>): void

  updateActionBar(currentActionBar: Partial<TActionBar>): void

  get actionBarSelectedItem(): undefined | TBagItem
}
