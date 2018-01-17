/* eslint no-console: ["off", { allow: ["warn"] }] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Cattleman = require('cattleman');
const shell = require('shelljs');
const appRootPath = require('app-root-path');
const pug = require('pug');
const dependency = require('pug-dependency');

const srcPath = 'src';
const distPath = 'app';
const dependence = dependency('src/**/*.pug');
const importMap = {};

function shorten(str) {
  let result = str.replace(appRootPath.toString(), '');
  result = result.substring(1);
  return result;
}

function build(module) {
  const srcPathDirs = srcPath.split('/');

  const file = path.parse(module);
  const moduleDirs = file.dir.split(path.sep);
  const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
  const targetPath = path.normalize(targetDirs.join(path.sep));
  const targetDir = path.join(distPath, targetPath);

  const options = { self: true, pretty: true };

  const fn = pug.compileFile(module, options);
  const html = fn();

  if (!fs.existsSync(targetDir)) { shell.mkdir('-p', targetDir); }

  fs.writeFileSync(path.join(targetDir, `${file.name}.html`), html);

  if (process.env.NODE_ENV !== 'production') {
    const sourceImports = dependence.find_dependencies(module);
    if (sourceImports.length && !importMap[module]) {
      importMap[module] = sourceImports.map(str => shorten(str));
    }
  }

  return importMap;
}

async function rebuild(module) {
  console.log('HTML: build', chalk.green(module));
  build(module);

  const files = Object.keys(importMap);
  files.forEach((file) => {
    const sources = importMap[file];

    if (sources.includes(module)) {
      console.log('HTML: rebuild', chalk.green(file));
      build(file);
    }
  });
}

(() => {
  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: ['base', 'styleguide', 'mixin'],
  });
  const modules = cattleman.gatherFiles('.pug');
  // const data = cattleman.gatherFiles('.json');

  modules.forEach((module) => {
    build(module);
  });
})();

exports.rebuild = rebuild;
