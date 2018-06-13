/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const shell = require('shelljs');
const appRootPath = require('app-root-path');
const log = require('./utils/logger');

const srcFolder = 'app';
const distFolder = 'docs';

async function build(module) {
  const file = path.parse(module);
  const targetDir = file.dir.replace(srcFolder, distFolder);

  await shell.mkdir('-p', targetDir);

  // the github repo is hosted under the /styleguide folder
  if (/.html$/.test(module)) {
    let html = fs.readFileSync(path.join(appRootPath.toString(), module), 'utf8');
    html = html.replace(/href="\//g, 'href="/styleguide/');
    html = html.replace(/src="\//g, 'src="/styleguide/');
    fs.writeFileSync(path.join(targetDir, file.base), html);
  } else {
    await shell.cp('-R', module, targetDir);
  }
}

async function run() {
  await new Promise((staticResolve) => {
    glob(`${srcFolder}/**/*`, async (error, files) => {
      if (error) {
        log.error('docs', error);
      } else {
        const modules = files;

        await Promise.all(modules.map(async (module) => {
          await build(module);
        }));

        staticResolve();
      }
    });
  });
}

if (require.main === module) run();

exports.run = run;
