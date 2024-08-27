import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const __dirname = import.meta.dirname

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'



function fixSourceMaps () {
    let currentInterval = null
    return {
        name: 'fix-source-map',
        enforce: 'post',
        transform: function (source) {
            if (currentInterval) {
                return
            }
            currentInterval = setInterval(function () {
                const nodeModulesPath = path.join(__dirname, 'node_modules', '.vite', 'deps')
                if (fs.existsSync(nodeModulesPath)) {
                    clearInterval(currentInterval)
                    currentInterval = null
                    const files = fs.readdirSync(nodeModulesPath)
                    files.forEach(function (file) {
                        const mapFile = file + '.map'
                        const mapPath = path.join(nodeModulesPath, mapFile)
                        if (fs.existsSync(mapPath)) {
                            let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
                            if (!mapData.sources || mapData.sources.length == 0) {
                                mapData.sources = [path.relative(mapPath, path.join(nodeModulesPath, file))]
                                fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8')
                            }
                        }
                    })
                }
            }, 100)
            return source
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    const isProd = mode === 'production'
    const watchSettings = isProd ? null : { usePolling: true }
    const extraPlugins = isProd ? [] : [fixSourceMaps()]
    return {
        plugins: [vue({
            include: '**/*.vue',
        }), ...extraPlugins],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            watch: watchSettings
        },
        build: {
            watch: watchSettings
        }
    }
})
