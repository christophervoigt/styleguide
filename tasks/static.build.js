/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const shell = require('shelljs');
const showError = require('./utils/error');

const srcFolder = 'src';
const distFolder = process.env.NODE_ENV === 'production' ? 'dist' : 'app';
const excludePattern = process.env.NODE_ENV === 'production' ? /(menu.json|styleguide)/ : /(menu.json)/;

async function build(module) {
  const file = path.parse(module);
  const targetDir = file.dir.replace(srcFolder, distFolder);

  await shell.mkdir('-p', targetDir);
  await shell.cp(module, targetDir);
}

function rebuild(event, module) {
  if (event === 'remove') {
    console.log('STATIC: remove', chalk.blue(module));

    const targetPath = module.replace(srcFolder, distFolder).replace('.scss', '.css');
    if (fs.existsSync(targetPath)) {
      console.log('STATIC: remove', chalk.blue(targetPath));
      fs.unlinkSync(targetPath);
    }
  } else if (!excludePattern.test(module)) {
    console.log('STATIC: copy', chalk.blue(module));
    build(module);
  }
}

async function run() {
  await new Promise((staticResolve) => {
    glob(`${srcFolder}/**/*{.eot,.woff,.woff2,.ttf,.json}`, async (error, files) => {
      if (error) {
        showError(error, 'STATIC: could not load files');
      } else {
        const modules = files.filter(file => !excludePattern.test(file));

        await Promise.all(modules.map(async (module) => {
          await build(module);
        }));

        staticResolve();
      }
    });
  });
}

if (require.main === module) run();

exports.rebuild = rebuild;
exports.run = run;
