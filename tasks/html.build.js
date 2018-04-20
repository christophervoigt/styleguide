/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const showError = require('./utils/error');
const Cattleman = require('cattleman');
const shell = require('shelljs');
const appRootPath = require('app-root-path');
const pug = require('pug');
const dependency = require('pug-dependency');

const srcPath = 'src';
const distPath = 'app';
const excludeWords = ['base', 'styleguide', 'mixin'];
const dependence = dependency('src/**/*.pug');
const importMap = {};
let builtModules = [];
let notKeep;


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

  const fn = pug.compileFile(module, { self: true });

  try {
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
      if (sourceImports.length && !importMap[module]) {
        importMap[module] = sourceImports.map(str => shorten(str));
      }
    }
  } catch (error) {
    showError(error, 'HTML: build failed');
  }
  return importMap;
}

async function rebuild(event, module) {
  console.log(importMap);
  console.log(`event: ${event} module: ${module} included:${builtModules.includes(module)}`);
  if (builtModules.includes(module) && event !== 'remove') {
    // rebuild  If includes(module) && !remove --> build(module); rebuild all dependencies
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
  } else if (!builtModules.includes(module) && event !== 'remove') {
    console.log('HTML: rebuild', chalk.red('// todo build and sync importMap'));
    // add      If !includes(module) && !remove --> build(module); write dependencies into importMap
    notKeep = 0;
    excludeWords.forEach((word) => {
      notKeep += module.includes(word);
    });
    if (!notKeep) {
      console.log('HTML: build', chalk.green(module));
      build(module);
    }
  } else if (event === 'remove') {
    console.log('HTML: rebuild', chalk.red('// todo remove file and sync importMap'));
    // remove   If remove --> build(module); find dependencies and delete??
    // output that dependencies missing?
  }
}

(() => {
  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: excludeWords,
  });
  const modules = cattleman.gatherFiles('.pug');
  // console.log('cattleman-respond:' + modules);
  builtModules = modules;

  modules.forEach((module) => {
    build(module);
  });
})();

exports.rebuild = rebuild;
