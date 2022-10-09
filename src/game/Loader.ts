import { TLoader } from './types/common'

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

  public loadFile(key: string, src: string, isJson = false): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(src)
        .then((response) => (isJson ? response.json() : response.text()))
        .then((data) => {
          this.files[key] = data
          resolve(data)
        })
        .catch(reject)
    })
  }

  public getImage(key: string): HTMLImageElement {
    const image = this.images[key]

    if (!image) {
      throw new Error('Image not found')
    }

    return <HTMLImageElement>image
  }

  public getFile(key: string): unknown {
    const file = this.files[key]

    if (!file) {
      throw new Error('File not found')
    }

    return file
  }
}
