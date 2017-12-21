const path = require('path');
const Cattleman = require('cattleman');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { minify } = require('uglify-es');

const srcPath = 'src';
const distPath = 'dist';

(async () => {
  const srcPathDirs = srcPath.split('/');
  const buildSourcemap = process.env.NODE_ENV !== 'production';

  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: ['cookie', 'variables', 'mixins', 'highlight'],
  });
  const modules = cattleman.gatherFiles('.js');

  await Promise.all(modules.map(async (module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));

    const bundle = await rollup.rollup({
      input: module,
      plugins: [
        resolve({
          jsnext: true,
          main: true,
        }),
        commonjs({
          namedExports: {
            'node_modules/jquery/dist/jquery.min.js': ['jquery'],
          },
        }),
        process.env.NODE_ENV === 'production' && uglify({}, minify),
      ],
    });

    await bundle.write({
      name: file.name,
      format: 'iife',
      file: path.join(distPath, targetPath, `${file.name}.js`),
      sourcemap: buildSourcemap,
      intro: `window.addEventListener('load',function(){new ${file.name}()});`,
    });
  }));
})();
