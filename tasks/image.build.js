/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const imagemin = require('imagemin');
const showError = require('./utils/error');

const srcFolder = 'src';
const distFolder = process.env.NODE_ENV === 'production' ? 'dist' : 'app';
const excludePattern = process.env.NODE_ENV === 'production' ? /(fonts|styleguide)/ : /(fonts)/;

async function build(module) {
  const file = path.parse(module);
  const targetDir = file.dir.replace(srcFolder, distFolder);

  await imagemin([module], targetDir);
}

async function rebuild(event, module) {
  if (event === 'remove') {
    console.log('IMG: remove', chalk.green(module));

    const targetPath = module.replace(srcFolder, distFolder).replace('.scss', '.css');
    if (fs.existsSync(targetPath)) {
      console.log('IMG: remove', chalk.green(targetPath));
      fs.unlinkSync(targetPath);
    }
  } else if (!excludePattern.test(module)) {
    console.log('IMG: build', chalk.green(module));
    build(module);
  }
}

(async () => {
  glob(`${srcFolder}/**/*{.jpg,.png,.svg,.ico}`, async (error, files) => {
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
