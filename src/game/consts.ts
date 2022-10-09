import { TTileData } from "./types/common";
import { EDirection } from "./enums/direction";
import { TTileAnimation } from "./types/tileAnimation";
import { APP_TILE_SIZE } from "../common/consts";

export const APP_TILE_CHARACTER_1_DATA: TTileData = {
  key: "character1_idle",
  tSize: APP_TILE_SIZE,
  tiles: {
    [EDirection.Left]: 1,
    [EDirection.Down]: 2,
    [EDirection.Up]: 3,
    [EDirection.Right]: 4,
  },
};

export const APP_TILE_ANIMATION: TTileAnimation = {
  8: {
    tiles: [9, 8],
    lastTick: 0,
    tick: 200,
    state: 0,
  },
};
