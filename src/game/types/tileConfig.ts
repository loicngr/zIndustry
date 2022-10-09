import { Dictionary } from "lodash";
import { EConfigTypes } from "../enums/configType";

export type TTileConfigTilesProperties = {
  name: string;
  type: EConfigTypes;
  value: boolean | string | number;
};

export type TTileConfigTiles = {
  id: number;
  properties: TTileConfigTilesProperties[];
};

export type TTileConfig = {
  columns: number;
  tiles: TTileConfigTiles[];
  tilesKeyed: Dictionary<TTileConfigTiles>;
  tilesWithCollide: number[];
};
