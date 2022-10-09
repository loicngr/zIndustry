import { Dictionary } from 'lodash'

export type TMapLayers = {
  id: number
  data: number[]
}

export type TMapConfig = {
  height: number
  width: number
  tileheight: number
  tileSize: number
  layers: Dictionary<TMapLayers>
}
