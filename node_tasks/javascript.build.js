const path = require('path');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es'); // ES6 minifier

const Cattleman = require('cattleman');

async function build () {
  // configure srcPath if necessary
  const srcPath = 'src';
  const srcPathDirs = srcPath.split('/');

  const cattleman = new Cattleman(srcPath);
  const modules = cattleman.gatherFiles('.js');

  await Promise.all(modules.map(async (module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));

    const bundle = await rollup.rollup({
      input: module,
      plugins: [
        uglify({}, minify),
      ],
    });

    await bundle.write({
      name: file.name,
      format: 'iife',
      file: path.join('dist', targetPath, `${file.name}.js`),
      sourcemap: true,
      intro: `window.addEventListener('load',function(){new ${file.name}()});`,
    });
  }));
}

(async () => {
  await build();
})();
