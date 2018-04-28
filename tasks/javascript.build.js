/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');
const showError = require('./utils/error');

const srcPath = 'src';
const distPath = process.env.NODE_ENV === 'production' ? 'dist' : 'app';
const excludePattern = /(base|styleguide)/;
const importMap = {};
const builtModules = [];

function shorten(str) {
  let result = str.replace(/\.\.\//g, '');
  result = result.replace(/\//g, path.sep);
  return result;
}

async function build(module) {
  const srcPathDirs = srcPath.split('/');
  const file = path.parse(module);
  const moduleDirs = file.dir.split(path.sep);
  const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
  const targetPath = path.normalize(targetDirs.join(path.sep));

  const bundle = await rollup.rollup({
    input: module,
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      resolve({ jsnext: true, main: true }),
      commonjs({
        namedExports: { 'node_modules/jquery/dist/jquery.min.js': ['jquery'] },
      }),
      process.env.NODE_ENV === 'production' && uglify({}, minify),
    ],
  }).catch(error => showError(error, 'JS: build failed'));

  const outputOptions = {
    name: file.name,
    format: 'iife',
    file: path.join(distPath, targetPath, `${file.name}.js`),
    sourcemap: process.env.NODE_ENV !== 'production',
    intro: `window.addEventListener('load',function(){new ${file.name}()});`,
  };

  if (bundle) {
    await bundle.write(outputOptions);

    if (process.env.NODE_ENV !== 'production') {
      const { map } = await bundle.generate(outputOptions);

      const obj = JSON.parse(map.toString());
      obj.sources = obj.sources.reverse();
      const sourceFile = shorten(obj.sources[0]);
      const sourceImports = obj.sources.slice(1);
      if (sourceImports.length) {
        importMap[sourceFile] = sourceImports.map(str => shorten(str));
      }
    }
  }
}

async function rebuild(event, module) {
  if (event === 'remove') {
    console.log('JS: remove', chalk.green(module));
    delete importMap[module];
    const index = builtModules.indexOf(module);
    if (index >= 0) {
      builtModules.splice(index, 1);
    }
  } else if (builtModules.includes(module)) {
    console.log('JS: update', chalk.green(module));
    build(module);
  } else if (!excludePattern.test(module)) {
    console.log('JS: add', chalk.green(module));
    build(module);
    builtModules.push(module);
  }

  const files = Object.keys(importMap);
  files.forEach((file) => {
    const sources = importMap[file];
    if (sources.includes(module)) {
      console.log('JS: update', chalk.green(file));
      build(file);
    }
  });
}

(async () => {
  glob('src/**/*.js', async (error, files) => {
    if (error) showError(error, 'JS: could not load files');

    const modules = files.filter(file => !excludePattern.test(file));

    // add only base.js
    const base = path.join('src', 'base', 'base.js');
    modules.push(base);

    if (process.env.NODE_ENV !== 'production') {
      // add styleguide.js too
      const styleguide = path.join('src', 'styleguide', 'styleguide.js');
      modules.push(styleguide);
    }

    await Promise.all(modules.map(async (module) => {
      await build(module);
    }));

    Array.prototype.push.apply(builtModules, modules);
  });
})();

exports.rebuild = rebuild;
