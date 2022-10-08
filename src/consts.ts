import {TMap, TTileAnimation} from "./types"
import {EDirection} from "./enums"

export const APP_DEBUG = import.meta.env.DEV

const APP_TILE_SIZE = 64

const APP_MAX_MAP_SIZE = APP_TILE_SIZE * 24

export const APP_MAP_SIZE = (_window?: Window): { width: number, height: number } => {
    let {innerWidth: width, innerHeight: height} = _window ?? window

    if (width > APP_MAX_MAP_SIZE) {
        width = APP_MAX_MAP_SIZE
    }

    if (height > APP_MAX_MAP_SIZE) {
        height = APP_MAX_MAP_SIZE
    }

    return {width, height}
}

export const APP_TILE_CHARACTER_1_DATA: TMap = {
    key: 'character1_idle',
    tSize: APP_TILE_SIZE,
    tiles: {
        [EDirection.Left]: 1,
        [EDirection.Down]: 2,
        [EDirection.Up]: 3,
        [EDirection.Right]: 4,
    }
}

export const APP_TILE_ANIMATION: TTileAnimation = {
    8: {
        tiles: [9, 8],
        lastTick: 0,
        tick: 200,
        state: 0
    }
}