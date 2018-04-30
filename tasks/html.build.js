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

const srcFolder = 'src';
const distFolder = 'app';
const excludePattern = /(base|styleguide|mixin)/;
const importMap = {};

function shorten(str) {
  let result = str.replace(appRootPath.toString(), '');
  result = result.substring(1);
  return result;
}

function build(module) {
  const file = path.parse(module);
  const targetDir = file.dir.replace(srcFolder, distFolder);
  const dependence = dependency(`${srcFolder}/**/*.pug`);

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
}

function rebuild(event, module) {
  if (event === 'remove') {
    console.log('HTML: remove', chalk.blue(module));
    delete importMap[module];

    const targetPath = module.replace(srcFolder, distFolder).replace('.pug', '.html');
    if (fs.existsSync(targetPath)) {
      console.log('HTML: remove', chalk.blue(targetPath));
      fs.unlinkSync(targetPath);
    }
  } else if (!excludePattern.test(module)) {
    console.log('HTML: build', chalk.blue(module));
    build(module);
  }

  const files = Object.keys(importMap);
  files.forEach((file) => {
    const sources = importMap[file];
    if (sources.includes(module)) {
      console.log('HTML: update', chalk.blue(file));
      build(file);
    }
  });
}

async function run() {
  await new Promise((htmlResolve) => {
    glob(`${srcFolder}/**/*.pug`, async (error, files) => {
      if (error) {
        showError(error, 'HTML: could not load files');
      } else {
        const modules = files.filter(file => !excludePattern.test(file));
        await Promise.all(modules.map(module => build(module)));

        htmlResolve();
      }
    });
  });
}

if (require.main === module) run();

exports.rebuild = rebuild;
exports.run = run;
