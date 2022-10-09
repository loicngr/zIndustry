import { Map } from "./Map";

export class Component {
  public map: Map;
  public screenX: number;
  public screenY: number;
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public speed: number;
  public image: HTMLImageElement | null;

  constructor(map: Map, x: number, y: number) {
    this.map = map;

    this.x = x;
    this.y = y;

    this.screenX = 0;
    this.screenY = 0;

    this.speed = 256; // pixels per second

    this.width = map.mapConfig.tileSize;
    this.height = map.mapConfig.tileSize;

    this.image = null;
  }
}
