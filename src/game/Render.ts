import { IGame } from './interfaces/game'
import { devLog, numberInNumber } from './utils'

export class Render {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  /**
   * Draw layers and character
   */
  render(): void {
    // background
    this.drawLayer(1)

    if (this.game.character && this.game.character.image && this.game.character.tileData) {
      const characterTile: number = this.game.character.tileData.tiles[this.game.character.direction]

      this.game.canvasContext.drawImage(
        this.game.character.image,
        (characterTile - 1) * this.game.character.tileData.tSize,
        0,
        this.game.character.tileData.tSize,
        this.game.character.tileData.tSize,
        this.game.character.screenX - this.game.character.width / 2,
        this.game.character.screenY - this.game.character.height / 2,
        this.game.character.tileData.tSize,
        this.game.character.tileData.tSize,
      )
    }

    // top
    this.drawLayer(2)

    this.drawTileOverlay()

    if (this.game.shouldDrawGrid) this.drawGrid()
  }

  /**
   * Draw layer in canvas
   */
  drawLayer(layerIndex: number): void {
    if (!this.game.tileAtlas || !this.game.camera || !this.game.map) {
      throw new Error('error')
    }

    const { startCol, endCol, startRow, endRow, offsetX, offsetY } = this.computeBasics()

    for (let c = startCol; c <= endCol; ++c) {
      for (let r = startRow; r <= endRow; ++r) {
        let tile: number | undefined = this.game.map.getTile(layerIndex, c, r)

        if (undefined === tile) {
          devLog('Tile not found')
          continue
        }

        const x = (c - startCol) * this.game.map.mapConfig.tileSize + offsetX
        const y = (r - startRow) * this.game.map.mapConfig.tileSize + offsetY

        if (tile in this.game.tileAnimation) {
          const deltaLastTick = this.game.previousElapsed - this.game.tileAnimation[tile].lastTick
          if (deltaLastTick > this.game.tileAnimation[tile].tick) {
            this.game.tileAnimation[tile].state += 1

            if (this.game.tileAnimation[tile].state >= this.game.tileAnimation[tile].tiles.length) {
              this.game.tileAnimation[tile].state = 0
            }

            this.game.tileAnimation[tile].lastTick = this.game.previousElapsed
          }

          tile = this.game.tileAnimation[tile].tiles[this.game.tileAnimation[tile].state]
        }

        const { sx, sy } = this._computeSxSy(tile)
        this._drawContextDraw(this.game.tileAtlas, sx, sy, x, y, this.game.map.mapConfig.tileSize)
      }
    }
  }

  private _drawContextDraw(
    tile: HTMLImageElement,
    sx: number,
    sy: number,
    x: number,
    y: number,
    tileSize: number,
  ): void {
    this.game.canvasContext.drawImage(
      tile,
      sx,
      sy,
      tileSize,
      tileSize,
      Math.round(x),
      Math.round(y),
      tileSize,
      tileSize,
    )
  }

  private _computeSxSy(tile: number): { sx: number; sy: number } {
    if (!this.game.tileAtlas || !this.game.camera || !this.game.map || !this.game.character) {
      throw new Error('error')
    }

    const sx = ((tile - 1) % this.game.map.tileConfig.columns) * this.game.map.mapConfig.tileSize
    const sy = numberInNumber(tile, this.game.map.tileConfig.columns) * this.game.map.mapConfig.tileSize

    return { sx, sy }
  }

  public computeBasics(): {
    startCol: number
    endCol: number
    startRow: number
    endRow: number
    offsetX: number
    offsetY: number
  } {
    if (!this.game.camera || !this.game.map) {
      throw new Error('error')
    }

    const startCol = Math.floor(this.game.camera.x / this.game.map.mapConfig.tileSize)
    const endCol = startCol + this.game.camera.width / this.game.map.mapConfig.tileSize + 1

    const startRow = Math.floor(this.game.camera.y / this.game.map.mapConfig.tileSize)
    const endRow = startRow + this.game.camera.height / this.game.map.mapConfig.tileSize + 1

    const offsetX = -this.game.camera.x + startCol * this.game.map.mapConfig.tileSize
    const offsetY = -this.game.camera.y + startRow * this.game.map.mapConfig.tileSize

    return { startCol, endCol, startRow, endRow, offsetX, offsetY }
  }

  /**
   * Draw grid on map
   */
  drawGrid(): void {
    if (!this.game.camera || !this.game.map) {
      throw new Error('error')
    }

    const width = this.game.map.mapConfig.width * this.game.map.mapConfig.tileSize
    const height = this.game.map.mapConfig.height * this.game.map.mapConfig.tileSize

    let x
    let y

    const mapRows = this.game.map.mapConfig.height
    const mapCols = this.game.map.mapConfig.width

    const baseStrokeStyle = this.game.canvasContext.strokeStyle

    this.game.canvasContext.strokeStyle = '#424242'

    const _common = (x: number, y: number, lineToX: number, lineToY: number) => {
      this.game.canvasContext.beginPath()
      this.game.canvasContext.moveTo(x, y)
      this.game.canvasContext.lineTo(lineToX, lineToY)
      this.game.canvasContext.stroke()
    }

    for (let r = 0; r < mapRows; ++r) {
      x = -this.game.camera.x
      y = r * this.game.map.mapConfig.tileSize - this.game.camera.y

      _common(x, y, width, y)
    }

    for (let c = 0; c < mapCols; ++c) {
      x = c * this.game.map.mapConfig.tileSize - this.game.camera.x
      y = -this.game.camera.y

      _common(x, y, x, height)
    }

    this.game.canvasContext.strokeStyle = baseStrokeStyle
  }

  drawTileOverlay(): void {
    if (!this.game.tileAtlas || !this.game.camera || !this.game.map || !this.game.character) {
      throw new Error('error')
    }

    const { startCol, startRow, offsetX, offsetY } = this.computeBasics()

    for (const strTile in this.game.map.tileOverlay) {
      const tile = Number(strTile)
      const position = this.game.map.tileOverlay[tile]
      const _y = this.game.map.getHeight(position.y)
      const _x = this.game.map.getWidth(position.x)

      const x = (_x - startCol) * this.game.map.mapConfig.tileSize + offsetX
      const y = (_y - startRow) * this.game.map.mapConfig.tileSize + offsetY

      const { sx, sy } = this._computeSxSy(tile)
      this._drawContextDraw(this.game.tileAtlas, sx, sy, x, y, this.game.map.mapConfig.tileSize)

      const { x: characterX, y: characterY } = this.game.character.predictNextPositionTile()
      this.game.map.tileOverlay[tile] = { x: characterX, y: characterY }
    }
  }
}
