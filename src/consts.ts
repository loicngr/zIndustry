import {TMap} from "./types"

export const APP_DEBUG = import.meta.env.DEV

export const APP_MAP_SIZE = 512

const APP_COLLISION_TILE = [3, 5]

export const APP_MAP: TMap = {
    cols: 12,
    rows: 12,
    tSize: 64,
    layers: [
        [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1,
            1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
    ],

    getTile: function (layerIndex: number, col: number, row: number): number {
        return this.layers[layerIndex][row * APP_MAP.cols + col]
    },

    setTile: function (layerIndex: number, col: number, row: number, tile: number): void {
        this.layers[layerIndex][row * APP_MAP.cols + col] = tile
    },

    isSolidTileAtXY: function (x: number, y: number) {
        const col = Math.floor(x / this.tSize)
        const row = Math.floor(y / this.tSize)

        return this.layers.reduce((res: boolean, _layer: any, index: number) => {
            const tile = this.getTile(index, col, row)
            const isSolid = APP_COLLISION_TILE.indexOf(tile) !== -1
            return res || isSolid
        }, false)
    },

    getCol: function (x: number) {
        return Math.floor(x / this.tSize)
    },

    getRow: function (y: number) {
        return Math.floor(y / this.tSize)
    },

    getX: function (col: number) {
        return col * this.tSize
    },

    getY: function (row: number) {
        return row * this.tSize
    }
}