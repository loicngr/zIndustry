const APP_FPS = 60
export const APP_FPS_INVERSE = 1000 / APP_FPS

export const APP_DEBUG = import.meta.env.DEV

export const APP_LIMIT_FPS = true

export const APP_MOVE_SPEED = 5

export const APP_TILE_SIZE = 16

export const APP_TILE_SIZE_SCALE = 2.5

export const _APP_TILE_SIZE = 16 * APP_TILE_SIZE_SCALE

export const APP_LEVEL_SIZE = {width: (16 * 20) * APP_TILE_SIZE_SCALE, height: (16 * 20) * APP_TILE_SIZE_SCALE}

export const APP_TILE_MAP_SIZE = {width: 458, height: 305}

export const APP_TILE_MAP_PATH = './tilemap/tilemap.png'

export const APP_TILE_MAP_DATA: any = {
    'grass_01': {x: 17, y: 17},
    'stone_01': {x: 153, y: 68},
    'door_01': {
        'close': {x: 255, y: 204},
        'open': {x: 255, y: 221}
    },
    'fence_01': {x: 85, y: 136},
    'player_01_idle': {
        'down': {x: 408, y: 0},
        'up': {x: 425, y: 0},
        'right': {x: 442, y: 0},
        'left': {x: 391, y: 0}
    },
}