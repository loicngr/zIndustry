import { Map } from "./Map";
import { ICharacter } from "./interfaces/character";

export class Camera {
  readonly height: number;
  readonly width: number;
  x: number;
  y: number;
  private readonly maxX: number;
  private readonly maxY: number;
  private character: undefined | ICharacter;

  constructor(map: Map, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;

    this.maxX = map.mapConfig.width * map.mapConfig.tileSize - width;
    this.maxY = map.mapConfig.height * map.mapConfig.tileSize - height;
  }

  public follow(character: ICharacter) {
    this.character = character;

    character.screenX = 0;
    character.screenY = 0;
  }

  public update() {
    if (!this.character) {
      return;
    }

    this.character.screenX = this.width / 2;
    this.character.screenY = this.height / 2;

    this.x = this.character.x - this.width / 2;
    this.y = this.character.y - this.height / 2;

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    if (
      this.character.x < this.width / 2 ||
      this.character.x > this.maxX + this.width / 2
    ) {
      this.character.screenX = this.character.x - this.x;
    }

    if (
      this.character.y < this.height / 2 ||
      this.character.y > this.maxY + this.height / 2
    ) {
      this.character.screenY = this.character.y - this.y;
    }
  }
}
