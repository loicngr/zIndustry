import {ConfigEnv, defineConfig, UserConfigExport} from 'vite';
import fs from "vite-plugin-fs"

export default function ({}: ConfigEnv): UserConfigExport {
    return defineConfig({
        build: {minify: true},
        plugins: [fs({rootDir: 'public'})],
    })
}