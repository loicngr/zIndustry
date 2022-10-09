import {defineConfig} from 'vite'
import type { UserConfigExport } from 'vite'

export default function (): UserConfigExport {
    return defineConfig({
        build: {minify: true},
        plugins: [],
    })
}