import {TLoader} from "./types"
import safeGet from "lodash/get"

export class Loader {
    private readonly images: TLoader

    constructor() {
        this.images = {}
    }

    public loadImage(key: string, src: string): Promise<HTMLImageElement | string> {
        const image = new Image()

        const _loader = new Promise<HTMLImageElement | string>((resolve, reject) => {
            image.onload = () => {
                this.images[key] = image
                resolve(image)
            }

            image.onerror = () => {
                reject(`Could not load image ${src}`)
            }
        })

        image.src = src
        return _loader
    }

    public getImage(key: string): HTMLImageElement | null {
        return safeGet(this.images, key, null)
    }
}