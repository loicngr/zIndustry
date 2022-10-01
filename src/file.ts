import fs from 'vite-plugin-fs/browser'

export function loadFileFromPath(path: string): Promise<string> {
    return new Promise<string>(function (resolve) {
        const file = fs.readFile(path)
        file.then(resolve)
    })
}