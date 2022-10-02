import {TMap} from "./types"
import {ICharacter} from "./interfaces"

export class Camera {
    readonly height: number
    readonly width: number
    x: number
    y: number
    private readonly maxX: number
    private readonly maxY: number
    private following: undefined | ICharacter

    constructor(map: TMap, width: number, height: number) {
        this.width = width
        this.height = height
        this.x = 0
        this.y = 0

        this.maxX = map.cols * map.tSize - width
        this.maxY = map.rows * map.tSize - height
    }

    public follow(character: ICharacter) {
        this.following = character

        character.screenX = 0
        character.screenY = 0
    }

    public update() {
        if (!this.following) {
            return
        }

        this.following.screenX = this.width / 2
        this.following.screenY = this.height / 2

        this.x = this.following.x - this.width / 2
        this.y = this.following.y - this.height / 2

        this.x = Math.max(0, Math.min(this.x, this.maxX))
        this.y = Math.max(0, Math.min(this.y, this.maxY))

        if (
            this.following.x < this.width / 2
            || this.following.x > this.maxX + this.width / 2
        ) {
            this.following.screenX = this.following.x - this.x
        }

        if (
            this.following.y < this.height / 2
            || this.following.y > this.maxY + this.height / 2
        ) {
            this.following.screenY = this.following.y - this.y
        }
    }
}