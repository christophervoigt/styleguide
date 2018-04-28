/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const shell = require('shelljs');
const pug = require('pug');
const dependency = require('pug-dependency');
const appRootPath = require('app-root-path');
const showError = require('./utils/error');

const srcPath = 'src';
const distPath = 'app';
const excludePattern = /(base|styleguide|mixin)/;
const importMap = {};
const builtModules = [];

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
  const dependence = dependency('src/**/*.pug');

  try {
    const fn = pug.compileFile(module, { self: true });
    const html = fn({
      require,
      usedModules: dependence.find_dependencies(module)
        .filter(filename => filename.includes('modules'))
        .map(str => shorten(str)),
    });

    if (!fs.existsSync(targetDir)) {
      shell.mkdir('-p', targetDir);
    }
    fs.writeFileSync(path.join(targetDir, `${file.name}.html`), html);

    if (process.env.NODE_ENV !== 'production') {
      const sourceImports = dependence.find_dependencies(module);
      if (sourceImports.length) {
        importMap[module] = sourceImports.map(str => shorten(str));
      }
    }
  } catch (error) {
    showError(error, 'HTML: build failed');
  }

  return importMap;
}

async function rebuild(event, module) {
  if (event === 'remove') {
    console.log('HTML: remove', chalk.green(module));
    delete importMap[module];
    const index = builtModules.indexOf(module);
    if (index >= 0) {
      builtModules.splice(index, 1);
    }
  } else if (builtModules.includes(module)) {
    console.log('HTML: update', chalk.green(module));
    build(module);
  } else if (!excludePattern.test(module)) {
    console.log('HTML: add', chalk.green(module));
    build(module);
    builtModules.push(module);
  }

  const files = Object.keys(importMap);
  files.forEach((file) => {
    const sources = importMap[file];
    if (sources.includes(module)) {
      console.log('HTML: update', chalk.green(file));
      build(file);
    }
  });
}

(() => {
  glob('src/**/*.pug', (error, files) => {
    if (error) {
      showError(error, 'HTML: could not load files');
    } else {
      const modules = files.filter(file => !excludePattern.test(file));
      modules.forEach((module) => {
        build(module);
      });

      Array.prototype.push.apply(builtModules, modules);
    }
  });
})();

exports.rebuild = rebuild;
