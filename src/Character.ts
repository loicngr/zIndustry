import {Component} from "./Component"
import {TMap, TPosition} from "./types"
import {ICharacter, IGame} from "./interfaces"
import {Loader} from "./Loader"
import {EDirection, EKey} from "./enums"

export class Character extends Component implements ICharacter {
    public direction: EDirection
    public tileData: TMap

    constructor(loader: Loader, map: TMap, x: number, y: number, tileData: TMap) {
        super(map, x, y)

        this.image = loader.getImage(tileData.key)
        this.direction = EDirection.None
        this.tileData = tileData
    }

    public move(delta: number, x: number, y: number): void {
        let nextXDirection = x * this.speed * delta
        let nextYDirection = y * this.speed * delta

        if (!this.collide({x: this.x + nextXDirection, y: this.y + nextYDirection})) {
            this.x += nextXDirection
            this.y += nextYDirection

            const maxX = this.map.cols * this.map.tSize
            const maxY = this.map.rows * this.map.tSize

            this.x = Math.max(0, Math.min(this.x, maxX))
            this.y = Math.max(0, Math.min(this.y, maxY))
        }
    }

    public predictNextPosition(position?: TPosition): TPosition {
        if (typeof position === 'undefined') {
            position = {x: this.x, y: this.y}
        }

        switch (this.direction) {
            case EDirection.Left:
                position.x -= (this.map.tSize / 2)
                break
            case EDirection.Right:
                position.x += (this.map.tSize / 2)
                break
            case EDirection.Up:
                position.y -= (this.map.tSize / 2)
                break
            case EDirection.Down:
                position.y += (this.map.tSize / 2)
                break
            default:
                break
        }

        return position
    }

    public predictNextPositionTile(position?: TPosition): TPosition {
        if (typeof position === 'undefined') {
            position = {x: this.x, y: this.y}
        }

        switch (this.direction) {
            case EDirection.Left:
                position.x -= this.map.tSize
                break
            case EDirection.Right:
                position.x += this.map.tSize
                break
            case EDirection.Up:
                position.y -= this.map.tSize
                break
            case EDirection.Down:
                position.y += this.map.tSize
                break
            default:
                break
        }

        return position
    }

    public handleMovement(game: IGame, updateDelta: number): void {
        let x = 0
        let y = 0

        if (game.keyboard.isPressed(EKey.Left)) {
            this.direction = EDirection.Left
            x = -1
        }
        if (game.keyboard.isPressed(EKey.Right)) {
            this.direction = EDirection.Right
            x = 1
        }
        if (game.keyboard.isPressed(EKey.Up)) {
            this.direction = EDirection.Up
            y = -1
        }
        if (game.keyboard.isPressed(EKey.Down)) {
            this.direction = EDirection.Down
            y = 1
        }

        this.move(updateDelta, x, y)
    }

    private collide(position: TPosition): boolean {
        return this.map.isSolidTileAtXY(this.predictNextPosition(position))
    }
}