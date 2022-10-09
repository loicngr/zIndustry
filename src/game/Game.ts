import { Loader } from "./Loader";
import { APP_TILE_ANIMATION, APP_TILE_CHARACTER_1_DATA } from "./consts";
import { Keyboard } from "./Keyboard";
import { Camera } from "./Camera";
import { Character } from "./Character";
import { devLog, forceCast, numberInNumber } from "./utils";
import { Map } from "./Map";
import { TTileAnimation } from "./types/tileAnimation";
import { EKey } from "./enums/key";
import { TPosition } from "./types/common";
import { IGame } from "./interfaces/game";
import { ICharacter } from "./interfaces/character";
import { APP_DEBUG, APP_MAP_SIZE } from "../common/consts";
import { TMapConfig } from "./types/mapConfig";
import { TTileConfig } from "./types/tileConfig";

export class Game implements IGame {
  readonly context: CanvasRenderingContext2D;
  previousElapsed: number;
  readonly loader: Loader;
  readonly keyboard: Keyboard;
  camera: undefined | Camera;
  character: undefined | ICharacter;
  tileAtlas: HTMLImageElement | null;
  shouldDrawGrid: boolean;
  tileAnimation: TTileAnimation;
  map: undefined | Map;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.previousElapsed = 0;
    this.tileAtlas = null;

    this.loader = new Loader();
    this.keyboard = new Keyboard();
    this.shouldDrawGrid = APP_DEBUG;
    this.tileAnimation = APP_TILE_ANIMATION;
  }

  run(): void {
    Promise.all(this.load()).then(() => {
      this.init();
      requestAnimationFrame(this.tick.bind(this));
    });
  }

  load(): Promise<HTMLImageElement | string>[] {
    return [
      this.loader.loadFile("tileConfig", `./tiles/tiles.json`, true),
      this.loader.loadFile("mapConfig", `./map/map.json`, true),
      this.loader.loadImage("tiles", "./tiles/tiles.png"),
      this.loader.loadImage(
        APP_TILE_CHARACTER_1_DATA.key,
        `./tiles/${APP_TILE_CHARACTER_1_DATA.key}.png`
      ),
    ];
  }

  tick(elapsed: number): void {
    requestAnimationFrame(this.tick.bind(this));
    const _APP_MAP_SIZE = APP_MAP_SIZE();

    this.context.clearRect(0, 0, _APP_MAP_SIZE.width, _APP_MAP_SIZE.height);
    const elapsedDelta = elapsed - this.previousElapsed;
    const delta = Math.min(elapsedDelta / 1000.0, 0.25);

    this.previousElapsed = elapsed;
    this.update(delta);
    this.render();
  }

  init(): void {
    const tileConfig = forceCast<TTileConfig>(
      this.loader.getFile("tileConfig")
    );
    const mapConfig = forceCast<TMapConfig>(this.loader.getFile("mapConfig"));
    this.map = new Map(mapConfig, tileConfig);

    const keysValues = Object.values(EKey);
    this.keyboard.listenForEvents(keysValues);

    this.tileAtlas = this.loader.getImage("tiles");
    this.character = new Character(
      this.loader,
      this.map,
      160,
      160,
      APP_TILE_CHARACTER_1_DATA
    );

    const _APP_MAP_SIZE = APP_MAP_SIZE();

    this.camera = new Camera(
      this.map,
      _APP_MAP_SIZE.width,
      _APP_MAP_SIZE.height
    );
    this.camera.follow(this.character);
  }

  update(delta: number): void {
    if (!this.character || !this.camera) {
      return;
    }

    this.character.handleMovement(this, delta);

    if (this.keyboard.isPressed(EKey.F1)) {
      this.keyboard.resetKey(EKey.F1);

      this.shouldDrawGrid = !this.shouldDrawGrid;
    }

    if (this.keyboard.isPressed(EKey.F)) {
      this.keyboard.resetKey(EKey.F);

      devLog(`x: ${this.character.x}, y: ${this.character.y}`);
      devLog(
        `screenX: ${this.character.screenX}, screenY: ${this.character.screenY}`
      );
    }

    if (this.keyboard.isPressed(EKey.E) && this.character) {
      this.keyboard.resetKey(EKey.E);

      this.spawnItem(1, this.character.predictNextPositionTile(), 8);
    }

    this.camera.update();
  }

  spawnItem(layerIndex: number, position: TPosition, tile: number): void {
    if (!this.map) {
      return;
    }

    const width = this.map.getWidth(position.x);
    const height = this.map.getHeight(position.y);

    if (this.map.isSolidTileAtRowCol(width, height)) {
      return;
    }

    this.map.setTile(layerIndex, width, height, tile);
  }

  render(): void {
    // background
    this.drawLayer(1);

    if (this.character && this.character.image && this.character.tileData) {
      const characterTile: number =
        this.character.tileData.tiles[this.character.direction];

      this.context.drawImage(
        this.character.image,
        (characterTile - 1) * this.character.tileData.tSize,
        0,
        this.character.tileData.tSize,
        this.character.tileData.tSize,
        this.character.screenX - this.character.width / 2,
        this.character.screenY - this.character.height / 2,
        this.character.tileData.tSize,
        this.character.tileData.tSize
      );
    }

    // top
    this.drawLayer(2);

    if (this.shouldDrawGrid) this.drawGrid();
  }

  drawLayer(layerIndex: number): void {
    if (!this.tileAtlas || !this.camera || !this.map) {
      return;
    }

    const startCol = Math.floor(this.camera.x / this.map.mapConfig.tileSize);
    const endCol = startCol + this.camera.width / this.map.mapConfig.tileSize;

    const startRow = Math.floor(this.camera.y / this.map.mapConfig.tileSize);
    const endRow = startRow + this.camera.height / this.map.mapConfig.tileSize;

    const offsetX = -this.camera.x + startCol * this.map.mapConfig.tileSize;
    const offsetY = -this.camera.y + startRow * this.map.mapConfig.tileSize;

    for (let c = startCol; c <= endCol; ++c) {
      for (let r = startRow; r <= endRow; ++r) {
        let tile: number | undefined = this.map.getTile(layerIndex, c, r);

        if (undefined === tile) {
          continue;
        }

        const x = (c - startCol) * this.map.mapConfig.tileSize + offsetX;
        const y = (r - startRow) * this.map.mapConfig.tileSize + offsetY;

        if (tile in this.tileAnimation) {
          const deltaLastTick =
            this.previousElapsed - this.tileAnimation[tile].lastTick;
          if (deltaLastTick > this.tileAnimation[tile].tick) {
            this.tileAnimation[tile].state += 1;

            if (
              this.tileAnimation[tile].state >=
              this.tileAnimation[tile].tiles.length
            ) {
              this.tileAnimation[tile].state = 0;
            }

            this.tileAnimation[tile].lastTick = this.previousElapsed;
          }

          tile = this.tileAnimation[tile].tiles[this.tileAnimation[tile].state];
        }

        const sx =
          ((tile - 1) % this.map.tileConfig.columns) *
          this.map.mapConfig.tileSize;
        const sy =
          numberInNumber(tile, this.map.tileConfig.columns) *
          this.map.mapConfig.tileSize;

        this.context.drawImage(
          this.tileAtlas,
          sx,
          sy,
          this.map.mapConfig.tileSize,
          this.map.mapConfig.tileSize,
          Math.round(x),
          Math.round(y),
          this.map.mapConfig.tileSize,
          this.map.mapConfig.tileSize
        );
      }
    }
  }

  drawGrid(): void {
    if (!this.camera || !this.map) {
      return;
    }

    const width = this.map.mapConfig.width * this.map.mapConfig.tileSize;
    const height = this.map.mapConfig.height * this.map.mapConfig.tileSize;

    let x;
    let y;

    const mapRows = this.map.mapConfig.height;
    const mapCols = this.map.mapConfig.width;

    const _common = (
      x: number,
      y: number,
      lineToX: number,
      lineToY: number
    ) => {
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(lineToX, lineToY);
      this.context.stroke();
    };

    for (let r = 0; r < mapRows; ++r) {
      x = -this.camera.x;
      y = r * this.map.mapConfig.tileSize - this.camera.y;

      _common(x, y, width, y);
    }

    for (let c = 0; c < mapCols; ++c) {
      x = c * this.map.mapConfig.tileSize - this.camera.x;
      y = -this.camera.y;

      _common(x, y, x, height);
    }
  }
}
