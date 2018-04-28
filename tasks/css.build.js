/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const shell = require('shelljs');
const sass = require('node-sass');
const tildeImporter = require('node-sass-tilde-importer');
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
  const targetDir = path.join(distPath, targetPath);

  await sass.render({
    file: module,
    importer: [tildeImporter],
    outFile: path.join(targetDir, `${file.name}.css`),
    outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
    sourceMap: process.env.NODE_ENV !== 'production',
    includePaths: ['node_modules'],
  }, (error, result) => {
    if (error) {
      showError(error, 'CSS: build failed');
    } else {
      if (!fs.existsSync(targetDir)) { shell.mkdir('-p', targetDir); }
      fs.writeFileSync(path.join(targetDir, `${file.name}.css`), result.css);

      if (process.env.NODE_ENV !== 'production') {
        fs.writeFileSync(path.join(targetDir, `${file.name}.css.map`), result.map);
        const obj = JSON.parse(result.map.toString());
        const sourceFile = shorten(obj.sources[0]);
        const sourceImports = obj.sources.slice(1);
        if (sourceImports.length) {
          importMap[sourceFile] = sourceImports.map(str => shorten(str));
        }
      }
    }
  });
}

async function rebuild(event, module) {
  if (event === 'remove') {
    console.log('CSS: remove', chalk.green(module));
    delete importMap[module];
    const index = builtModules.indexOf(module);
    if (index >= 0) {
      builtModules.splice(index, 1);
    }
  } else if (builtModules.includes(module)) {
    console.log('CSS: update', chalk.green(module));
    build(module);
  } else if (!excludePattern.test(module)) {
    console.log('CSS: add', chalk.green(module));
    build(module);
    builtModules.push(module);
  }

  const files = Object.keys(importMap);
  files.forEach((file) => {
    const sources = importMap[file];
    if (sources.includes(module)) {
      console.log('CSS: update', chalk.green(file));
      build(file);
    }
  });
}

(async () => {
  glob('src/**/*.scss', async (error, files) => {
    if (error) {
      showError(error, 'CSS: could not load files');
    } else {
      const modules = files.filter(file => !excludePattern.test(file));

      // add only base.scss
      const base = path.join('src', 'base', 'base.scss');
      modules.push(base);

      if (process.env.NODE_ENV !== 'production') {
        // add styleguide.scss too
        const styleguide = path.join('src', 'styleguide', 'styleguide.scss');
        modules.push(styleguide);
      }

      await Promise.all(modules.map(async (module) => {
        await build(module);
      }));

      Array.prototype.push.apply(builtModules, modules);
    }
  });
})();

exports.rebuild = rebuild;
