import {ConfigEnv, defineConfig, UserConfigExport} from 'vite';

export default function ({}: ConfigEnv): UserConfigExport {
    return defineConfig({
        build: {minify: true},
        plugins: [],
    })
}