import { keyBy } from 'lodash'
import { TMapConfig } from './types/mapConfig'
import { TTileConfig } from './types/tileConfig'
import { TPosition } from './types/common'
import safeGet from 'lodash/get'

export class Map {
  public mapConfig: TMapConfig
  public tileConfig: TTileConfig
  public tileOverlay: { [key: number]: TPosition }

  constructor(mapConfig: TMapConfig, tileConfig: TTileConfig) {
    this.tileConfig = tileConfig
    this.mapConfig = mapConfig
    this.tileOverlay = {}

    this.mapConfig.layers = keyBy(this.mapConfig.layers, 'id')
    this.mapConfig.tileSize = this.mapConfig.tileheight

    this.tileConfig.tilesKeyed = keyBy(this.tileConfig.tiles, 'id')
    this.tileConfig.tilesWithCollide = this.tileConfig.tiles
      .filter((i) => {
        return i.properties.find((ii) => ii.name === 'collide' && ii.value === true)
      })
      .map((i) => i.id + 1)
  }

  public setTile(index: number, width: number, height: number, tile: number): void {
    this.mapConfig.layers[index].data[height * this.mapConfig.width + width] = tile
  }

  public isSolidTileAtRowCol(width: number, height: number): boolean {
    for (const layersKey in this.mapConfig.layers) {
      const tile = this.getTile(parseInt(layersKey), width, height)

      if (tile !== undefined && this.tileConfig.tilesWithCollide.indexOf(tile) !== -1) {
        return true
      }
    }

    return false
  }

  public isSolidTileAtXY(position: TPosition): boolean {
    for (const layersKey in this.mapConfig.layers) {
      const width: number = Math.floor(position.x / this.mapConfig.tileSize)
      const height: number = Math.floor(position.y / this.mapConfig.tileSize)

      const tile = this.getTile(parseInt(layersKey), width, height)

      if (tile !== undefined && this.tileConfig.tilesWithCollide.indexOf(tile) !== -1) {
        return true
      }
    }

    return false
  }

  // get col
  getWidth(x: number) {
    return Math.floor(x / this.mapConfig.tileSize)
  }

  // get row
  getHeight(y: number) {
    return Math.floor(y / this.mapConfig.tileSize)
  }

  getX(width: number) {
    return width * this.mapConfig.tileSize
  }

  getY(height: number) {
    return height * this.mapConfig.tileSize
  }

  public getTile(index: number, width: number, height: number): number | undefined {
    return safeGet(this.mapConfig.layers, [index, 'data', height * this.mapConfig.width + width], undefined)
  }
}
