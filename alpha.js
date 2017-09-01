const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
// const uglify = require('rollup-plugin-uglify')
// const minify = require('uglify-es').minify // ES6 minifier

const Cattleman = require('cattleman')


const build = async function() {

    // configure path if necessary
    const srcPath = 'src'
    const srcPathDirs = srcPath.split('/')

    const cattleman = new Cattleman(srcPath)
    const modules = cattleman.gatherFiles('.js')

    await Promise.all(modules.map(async (module) => {
        const file = path.parse(module)

        const moduleDirs = file.dir.split(path.sep)
        const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length)
        const targetPath = path.normalize(targetDirs.join(path.sep))

        const bundle = await rollup.rollup({
            entry: module,
            // plugins: [
            //     uglify({}, minify)
            // ]
        })

        await bundle.write({
            moduleName: file.name,
            format: 'iife',
            dest: path.join('lib', targetPath, file.name + '.js'),
            // sourceMap: true,
            intro: `window.addEventListener(\'load\',function(){new ${file.name}()});`
        })
    }))
}


(async () => {
    await build()
});
