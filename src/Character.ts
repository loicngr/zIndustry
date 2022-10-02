import {Component} from "./Component"
import {TMap, TPosition} from "./types"
import {ICharacter} from "./interfaces"
import {Loader} from "./Loader"
import {EDirection} from "./enums";

export class Character extends Component implements ICharacter {
    public direction: EDirection;

    constructor(loader: Loader, map: TMap, x: number, y: number) {
        super(map, x, y)

        this.image = loader.getImage('character')
        this.direction = EDirection.None
    }

    public move(delta: number, x: number, y: number): void {
        this.x += x * this.speed * delta
        this.y += y * this.speed * delta

        this.collide(x, y)

        const maxX = this.map.cols * this.map.tSize;
        const maxY = this.map.rows * this.map.tSize;

        this.x = Math.max(0, Math.min(this.x, maxX))
        this.y = Math.max(0, Math.min(this.y, maxY))
    }

    public getFrontPosition(): TPosition {
        let position = {x: this.x, y: this.y}

        switch (this.direction) {
            case EDirection.Left:
                position.x = Math.floor(position.x - this.map.tSize)
                break
            case EDirection.Right:
                position.x = Math.floor(position.x + this.map.tSize)
                break
            case EDirection.Up:
                position.y = Math.floor(position.y - this.map.tSize)
                break
            case EDirection.Down:
                position.y = Math.floor(position.y + this.map.tSize)
                break
            default:
                break
        }

        return position
    }


    private collide(x: number, y: number): void {
        let row
        let col

        // -1 (map start at 0)
        const left = this.x - this.width / 2
        const right = this.x + this.width / 2 - 1
        const top = this.y - this.height / 2
        const bottom = this.y + this.height / 2 - 1

        // console.log('left: ', left, 'right: ', right, 'top: ', top, 'bottom: ', bottom)

        const collision =
            this.map.isSolidTileAtXY(left, top) ||
            this.map.isSolidTileAtXY(right, top) ||
            this.map.isSolidTileAtXY(right, bottom) ||
            this.map.isSolidTileAtXY(left, bottom)

        if (!collision) {
            return
        }

        if (y > 0) {
            row = this.map.getRow(bottom)
            this.y = -this.height / 2 + this.map.getY(row)
        } else if (y < 0) {
            row = this.map.getRow(top)
            this.y = this.height / 2 + this.map.getY(row + 1)
        } else if (x > 0) {
            col = this.map.getCol(right);
            this.x = -this.width / 2 + this.map.getX(col)
        } else if (x < 0) {
            col = this.map.getCol(left);
            this.x = this.width / 2 + this.map.getX(col + 1)
        }
    }
}