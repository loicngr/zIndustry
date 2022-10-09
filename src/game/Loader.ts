import safeGet from "lodash/get"
import {TLoader} from "./types/common"

export class Loader {
    private readonly images: TLoader
    private readonly files: TLoader

    constructor() {
        this.images = {}
        this.files = {}
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

    public loadFile(key: string, src: string, isJson: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then((response) => isJson ? response.json() : response.text())
                .then((data) => {
                    this.files[key] = data
                    resolve(data)
                })
                .catch(reject)
        })
    }

    public getImage(key: string): HTMLImageElement | null {
        return safeGet(this.images, key, null)
    }

    public getFile(key: string): any | null {
        return safeGet(this.files, key, null)
    }
}