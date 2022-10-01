import './style.css'
import {EComponentType, EDirection, EKey} from "./enums";
import {
    APP_FPS_INVERSE,
    APP_LEVEL_SIZE,
    APP_LIMIT_FPS,
    APP_MOVE_SPEED,
    APP_REAL_TILE_SIZE,
    APP_TILE_MAP_DATA,
    APP_TILE_MAP_PATH,
    APP_TILE_MAP_SIZE,
    APP_TILE_SIZE
} from "./consts";
import {TComponent, TNewComponent, TPreload} from "./types";
import {IComponent, IKeys} from "./interfaces";
import _ from 'lodash'

class Game {
    private context: CanvasRenderingContext2D | undefined | null
    private lastTime: number
    private readonly components: IComponent
    private lastComponentId: number | undefined
    private readonly canvas: HTMLCanvasElement
    private readonly keys: IKeys
    private readonly tileMapContext: CanvasRenderingContext2D

    constructor(tileMapContext: CanvasRenderingContext2D) {
        this.tileMapContext = tileMapContext
        this.canvas = document.createElement('canvas')
        this.lastTime = performance.now()
        this.components = {}
        this.keys = {}
    }

    // @ts-ignore
    private static isComponentType(component: TComponent, type: EComponentType): boolean {
        return component.type === type
    }

    private static componentsCollisionWith(from: TComponent, components: IComponent): undefined | TComponent {
        for (const componentsKey in components) {
            const component = components[componentsKey]

            if (component.id === from.id || !component.collision) {
                continue
            }

            if (Game.collisionWith(from, component)) {
                return component
            }
        }

        return undefined
    }

    private static collisionWith(from: TComponent, to: TComponent): boolean {
        let collision = true

        const fromLeft = from.x
        const fromRight = from.x + from.width
        const fromTop = from.y
        const fromBottom = from.y + from.height

        const toLeft = to.x
        const toRight = to.x + to.width
        const toTop = to.y
        const toBottom = to.y + to.height

        if (
            (fromBottom < toTop) ||
            (fromTop > toBottom) ||
            (fromRight < toLeft) ||
            (fromLeft > toRight)
        ) {
            collision = false
        }

        return collision
    }

    private static _createImageBitMap(context: CanvasRenderingContext2D, x: number, y: number): Promise<ImageBitmap> {
        const imageData = context.getImageData(x, y, APP_REAL_TILE_SIZE, APP_REAL_TILE_SIZE)
        return createImageBitmap(imageData)
    }

    public clear(): void {
        if (!this.context) {
            return
        }

        const tileGrassBitMap = Game._createImageBitMap(
            this.tileMapContext,
            _.get(APP_TILE_MAP_DATA, ['grass_01', 'x']),
            _.get(APP_TILE_MAP_DATA, ['grass_01', 'y'])
        )

        tileGrassBitMap.then((tileImage) => {
            if (!this.context) {
                return
            }

            for (let x = 0; x < APP_LEVEL_SIZE.width; x += APP_TILE_SIZE) {
                this.context.drawImage(tileImage, x, 0, APP_TILE_SIZE, APP_TILE_SIZE)

                for (let y = 0; y < APP_LEVEL_SIZE.height; y += APP_TILE_SIZE) {
                    this.context.drawImage(tileImage, x, y, APP_TILE_SIZE, APP_TILE_SIZE)
                }
            }
        })
    }

    public createComponent(component: TNewComponent): void {
        const id = (this.lastComponentId ?? 0) + 1

        const newComponent: TComponent = {
            collision: true,
            state: false,
            direction: EDirection.None,
            ...component,
            id,
            update: () => {
                if (!this.context) {
                    return
                }

                let tileId = _.get(APP_TILE_MAP_DATA, newComponent.tileId)

                switch (newComponent.type) {
                    case EComponentType.Player:
                        newComponent.move!(this.components, this.keys, this.lastTime)
                        tileId = _.get(APP_TILE_MAP_DATA, [newComponent.tileId, newComponent.direction])
                        break
                    case EComponentType.Door:
                        tileId = _.get(APP_TILE_MAP_DATA, [newComponent.tileId, !newComponent.state ? 'close' : 'open'])
                        break
                    default:
                        break
                }

                if (!tileId) {
                    return
                }

                const tileBitMap = Game._createImageBitMap(this.tileMapContext, tileId.x, tileId.y)

                tileBitMap.then((tileImage) => {
                    if (!this.context) {
                        return
                    }

                    this.context.drawImage(tileImage, newComponent.x, newComponent.y, APP_TILE_SIZE, APP_TILE_SIZE)
                })
            }
        }

        switch (newComponent.type) {
            case EComponentType.Player: {
                newComponent.move = function (components: IComponent, keys: IKeys, _lastTime: number) {
                    this.speedX = 0
                    this.speedY = 0

                    if (keys[EKey.Right]) {
                        this.speedX = APP_MOVE_SPEED
                        this.direction = EDirection.Right
                    }

                    if (keys[EKey.Left]) {
                        this.speedX = -APP_MOVE_SPEED
                        this.direction = EDirection.Left
                    }

                    if (keys[EKey.Up]) {
                        this.speedY = -APP_MOVE_SPEED
                        this.direction = EDirection.Up
                    }

                    if (keys[EKey.Down]) {
                        this.speedY = APP_MOVE_SPEED
                        this.direction = EDirection.Down
                    }

                    if (keys[EKey.E]) {
                        let _component = _.cloneDeep(newComponent)

                        switch (this.direction) {
                            case EDirection.Up:
                                _component.y -= APP_TILE_SIZE
                                break
                            case EDirection.Down:
                                _component.y += APP_TILE_SIZE
                                break
                            case EDirection.Left:
                                _component.x -= APP_TILE_SIZE
                                break
                            case EDirection.Right:
                                _component.x += APP_TILE_SIZE
                                break
                        }

                        if (newComponent.collision) {
                            const collisionComponent = Game.componentsCollisionWith(_component, components)

                            if (collisionComponent && typeof collisionComponent.interact !== 'undefined') {
                                switch (collisionComponent.type) {
                                    case EComponentType.Door:
                                        collisionComponent.interact()
                                        keys[EKey.E] = false
                                        break
                                    default:
                                        break
                                }
                            }
                        }
                    }

                    let collisionWith: undefined | TComponent

                    if (newComponent.collision) {
                        const _component = {
                            ..._.cloneDeep(newComponent),
                            x: newComponent.x + this.speedX,
                            y: newComponent.y + this.speedY
                        }

                        collisionWith = Game.componentsCollisionWith(_component, components)
                    }

                    if (typeof collisionWith === 'undefined') {
                        this.x += this.speedX
                        this.y += this.speedY
                    }

                }
                break
            }
            case EComponentType.Door:
            default:
                if (component.canInteract) {
                    newComponent.interact = function () {
                        this.state = !this.state
                    }
                }
                break
        }

        this.components[id] = newComponent

        this.lastComponentId = id
    }

    public start(): void {
        this.canvas.width = APP_LEVEL_SIZE.width
        this.canvas.height = APP_LEVEL_SIZE.height

        window.addEventListener('keydown', (keyEvent) => {
            this.keys[keyEvent.code] = (keyEvent.type === "keydown")
        })

        window.addEventListener('keyup', (keyEvent) => {
            this.keys[keyEvent.code] = (keyEvent.type === "keydown")
        })

        this.context = this.canvas.getContext('2d')

        document.body.insertBefore(this.canvas, document.body.childNodes[0])

        this.update()
    }

    // @ts-ignore
    private getPlayerComponent(): TComponent {
        return Object.values(this.components).find(c => c.type === EComponentType.Player)
    }

    private execute(_delta: number, _time: number): void {
        this.clear()

        for (const componentsKey in this.components) {
            const component = this.components[componentsKey]

            if (!component) {
                continue
            }

            component.update()
        }
    }

    private update(): void {
        const time = performance.now()
        const delta = time - this.lastTime

        if (APP_LIMIT_FPS) {
            if (delta >= APP_FPS_INVERSE) {
                this.execute(delta, time)
                this.lastTime = time
            }
        } else {
            this.execute(delta, time)
            this.lastTime = time
        }

        requestAnimationFrame(this.update.bind(this))
    }
}

function _preLoad(): TPreload {
    // Load TileMap image into canvas and insert in DOM
    const tileMapCanvasElement = document.createElement('canvas')
    tileMapCanvasElement.width = APP_TILE_MAP_SIZE.width
    tileMapCanvasElement.height = APP_TILE_MAP_SIZE.height
    const tileMapContext = tileMapCanvasElement.getContext('2d', {willReadFrequently: true})!

    const tileMapImage = new Image(APP_TILE_MAP_SIZE.width, APP_TILE_MAP_SIZE.height)
    tileMapImage.onload = () => {
        tileMapContext.drawImage(
            tileMapImage,
            0,
            0,
            APP_TILE_MAP_SIZE.width,
            APP_TILE_MAP_SIZE.height
        )
    }
    tileMapImage.src = APP_TILE_MAP_PATH

    tileMapCanvasElement.style.display = 'none'
    document.body.insertBefore(tileMapCanvasElement, document.body.childNodes[0])

    return {
        tileMapContext
    }
}

function main(): void {
    const {tileMapContext} = _preLoad()

    const game = new Game(tileMapContext)
    Object.defineProperty(window, '_game', {value: game, writable: false})

    game.createComponent({
        x: 0,
        y: 0,
        width: APP_TILE_SIZE,
        height: APP_TILE_SIZE,
        tileId: 'player_01_idle',
        type: EComponentType.Player
    })

    game.createComponent({
        x: APP_TILE_SIZE * 5,
        y: APP_TILE_SIZE * 5,
        width: APP_TILE_SIZE,
        height: APP_TILE_SIZE,
        tileId: 'fence_01',
        type: EComponentType.Fence
    })

    game.createComponent({
        x: APP_TILE_SIZE * 10,
        y: APP_TILE_SIZE * 5,
        width: APP_TILE_SIZE,
        height: APP_TILE_SIZE,
        canInteract: true,
        tileId: 'door_01',
        type: EComponentType.Door
    })

    game.start()
}

main()