const path = require('path');
const fs = require('fs');
const Cattleman = require('cattleman');
const shell = require('shelljs');
const pug = require('pug');


const srcPath = 'src';
const distPath = 'app';

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

exports.build = build;
