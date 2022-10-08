import {Dictionary} from 'lodash'
import {EConfigTypes} from "./enums"

export type TMap = CallableFunction | number[][] | number[] | string | number | any | { [key: string]: TMap }

export type TLoader = { [key: string]: HTMLImageElement }

export type TKeyboard = { [key: string]: boolean }

export type TPosition = { x: number, y: number }

export type TTileAnimation = {
    [key: number]: {
        tiles: number[]
        lastTick: number
        tick: number
        state: number
    }
}

export type TMapLayers = {
    id: number,
    data: number[],
}

export type TMapConfig = {
    height: number,
    width: number,
    tileheight: number,
    tileSize: number,
    layers: Dictionary<TMapLayers>
}

export type TTileConfigTilesProperties = {
    name: string,
    type: EConfigTypes,
    value: boolean | string | number
}

export type TTileConfigTiles = {
    id: number,
    properties: TTileConfigTilesProperties[],
}

export type TTileConfig = {
    columns: number,
    tiles: TTileConfigTiles[],
    tilesKeyed: Dictionary<TTileConfigTiles>,
    tilesWithCollide: number[]
}