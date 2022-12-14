import { Component } from './Component'
import { EDirection } from './enums/direction'
import { Loader } from './Loader'
import { Map } from './Map'
import { TPosition, TTileData } from './types/common'
import { EKey } from './enums/key'
import { ICharacter } from './interfaces/character'
import { IGame } from './interfaces/game'
import { TBagItem, TInventory } from './types/inventory'
import { TActionBar } from './types/actionBar'
import { Ui } from './Ui'
import { ITEMS_CONVEYOR_KEY } from '../common/consts'
import { devLog } from './utils'

export class Character extends Component implements ICharacter {
  public direction: EDirection
  public tileData: TTileData
  private _actionBar: TActionBar = {
    size: 5,
    items: [
      {
        id: 1,
        name: 'conveyor',
        count: 10,
        key: EKey.Digit1,
        type: ITEMS_CONVEYOR_KEY,
      },
    ],
    selected: undefined,
  }
  public inventory: TInventory = {
    bags: [
      {
        id: 1,
        size: 10,
        items: [],
      },
    ],
  }
  private readonly _ui: Ui

  constructor(ui: Ui, loader: Loader, map: Map, x: number, y: number, tileData: TTileData) {
    super(map, x, y)

    this.image = loader.getImage(tileData.key)
    this.direction = EDirection.None
    this.tileData = tileData
    this._ui = ui
  }

  public get actionBarSelectedItem(): undefined | TBagItem {
    if (!this.actionBar.selected) {
      return
    }

    return this.actionBar.items.find((i) => this.actionBar.selected === i.id)
  }

  public move(delta: number, x: number, y: number): void {
    const nextXDirection = x * this.speed * delta
    const nextYDirection = y * this.speed * delta

    if (!this.collide({ x: this.x + nextXDirection, y: this.y + nextYDirection })) {
      this.x += nextXDirection
      this.y += nextYDirection

      const maxX = this.map.mapConfig.width * this.map.mapConfig.tileSize
      const maxY = this.map.mapConfig.height * this.map.mapConfig.tileSize

      this.x = Math.max(0, Math.min(this.x, maxX))
      this.y = Math.max(0, Math.min(this.y, maxY))
    }
  }

  public updateActionBar(value: Partial<TActionBar>): void {
    const currentActionBar = this._actionBar

    this.actionBar = {
      ...currentActionBar,
      ...value,
    }
  }

  public updateActionBarItem(itemId: number, value: Partial<TBagItem>): void {
    const actionBarItems = [...this._actionBar.items]
    const itemIndex = actionBarItems.findIndex((i) => i.id === itemId)

    if (itemIndex === -1) {
      devLog("Can't update item")
      return
    }

    actionBarItems[itemIndex] = {
      ...actionBarItems[itemIndex],
      ...value,
    }

    const actionBar = { ...this._actionBar }

    this.updateActionBar({
      ...actionBar,
      items: actionBarItems,
    })
  }

  public set actionBar(value: TActionBar) {
    this._actionBar = value
    this._ui.update()
  }

  public get actionBar(): TActionBar {
    return this._actionBar
  }

  public predictNextPosition(position?: TPosition): TPosition {
    if (typeof position === 'undefined') {
      position = { x: this.x, y: this.y }
    }

    switch (this.direction) {
      case EDirection.Left:
        position.x -= this.map.mapConfig.tileSize / 2
        break
      case EDirection.Right:
        position.x += this.map.mapConfig.tileSize / 2
        break
      case EDirection.Up:
        position.y -= this.map.mapConfig.tileSize / 2
        break
      case EDirection.Down:
        position.y += this.map.mapConfig.tileSize / 2
        break
      default:
        break
    }

    return position
  }

  public predictNextPositionTile(position?: TPosition): TPosition {
    if (typeof position === 'undefined') {
      position = { x: this.x, y: this.y }
    }

    switch (this.direction) {
      case EDirection.Left:
        position.x -= this.map.mapConfig.tileSize
        break
      case EDirection.Right:
        position.x += this.map.mapConfig.tileSize
        break
      case EDirection.Up:
        position.y -= this.map.mapConfig.tileSize
        break
      case EDirection.Down:
        position.y += this.map.mapConfig.tileSize
        break
      default:
        break
    }

    return position
  }

  public handleMovement(game: IGame, updateDelta: number): void {
    let x = 0
    let y = 0

    if (game.keyboard.isPressed(EKey.Left)) {
      this.direction = EDirection.Left
      x = -1
    }
    if (game.keyboard.isPressed(EKey.Right)) {
      this.direction = EDirection.Right
      x = 1
    }
    if (game.keyboard.isPressed(EKey.Up)) {
      this.direction = EDirection.Up
      y = -1
    }
    if (game.keyboard.isPressed(EKey.Down)) {
      this.direction = EDirection.Down
      y = 1
    }

    this.move(updateDelta, x, y)
    this.updateFloatingTexts(game)
  }

  private updateFloatingTexts(game: IGame): void {
    const { offsetX, offsetY, startCol, startRow } = game.render.computeBasics()

    const r = this.map.getHeight(this.y)
    const c = this.map.getWidth(this.x)

    const x = (c - startCol) * this.map.mapConfig.tileSize + offsetX
    const y = (r - startRow) * this.map.mapConfig.tileSize + offsetY

    game.floatingTexts.elements.forEach((i) => game.floatingTexts.update(i.id, { at: { x, y } }))
  }

  private collide(position: TPosition): boolean {
    return this.map.isSolidTileAtXY(this.predictNextPosition(position))
  }
}
