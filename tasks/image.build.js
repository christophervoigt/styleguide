/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const imagemin = require('imagemin');
const showError = require('./utils/error');

const srcPath = 'src';
const distPath = process.env.NODE_ENV === 'production' ? 'dist' : 'app';
const excludePattern = process.env.NODE_ENV === 'production' ? /(fonts|styleguide)/ : /(fonts)/;

async function build(module) {
  const srcPathDirs = srcPath.split('/');

  const file = path.parse(module);
  const moduleDirs = file.dir.split(path.sep);
  const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
  const targetPath = path.normalize(targetDirs.join(path.sep));
  const targetDir = path.join(distPath, targetPath);

  await imagemin([module], targetDir);
}

async function rebuild(event, module) {
  if (event === 'remove') {
    console.log('IMG: remove', chalk.green(module));
    // @ToDo: remove module from target directory
  } else if (!excludePattern.test(module)) {
    console.log('IMG: build', chalk.green(module));
    build(module);
  }
}

(async () => {
  glob('src/**/*{.jpg,.png,.svg,.ico}', async (error, files) => {
    if (error) {
      showError(error, 'IMG: could not load files');
    } else {
      const modules = files.filter(file => !excludePattern.test(file));

      await Promise.all(modules.map(async (module) => {
        await build(module);
      }));
    }
  });
})();

exports.rebuild = rebuild;
