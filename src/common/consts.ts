import { TBagItemType } from '../game/types/inventory'

/**
 * @ts-ignore */
export const APP_DEBUG = import.meta.env.DEV

export const APP_TILE_SIZE = 64

export const APP_MAX_MAP_SIZE = APP_TILE_SIZE * 60

export const APP_MAP_SIZE = (_window?: Window): { width: number; height: number } => {
  let { innerWidth: width, innerHeight: height } = _window ?? window

  if (width > APP_MAX_MAP_SIZE) {
    width = APP_MAX_MAP_SIZE
  }

  if (height > APP_MAX_MAP_SIZE) {
    height = APP_MAX_MAP_SIZE
  }

  return { width, height }
}

export const ITEMS_CONVEYOR_KEY = 'conveyor'
export const ITEMS_TYPES: TBagItemType = {
  [ITEMS_CONVEYOR_KEY]: {
    tile: 8,
    canPlace: true,
  },
}
