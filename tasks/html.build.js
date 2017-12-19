const path = require('path');
const fs = require('fs');
const Cattleman = require('cattleman');
const pug = require('pug');


const srcPath = 'src';
const distPath = 'dist';

(() => {
  const srcPathDirs = srcPath.split('/');
  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: ['base', 'styleguide', 'mixin'],
  });
  const modules = cattleman.gatherFiles('.pug');

  // todo
  // load other JSON Files
  const packageJSON = JSON.parse(fs.readFileSync('package.json'));

  modules.forEach((module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));
    const targetDir = path.join(distPath, targetPath);

    const options = { self: true, pretty: true };

    const fn = pug.compileFile(module, options);
    const html = fn(packageJSON);

    if (!fs.existsSync(targetDir)) { fs.mkdirSync(targetDir); }

    fs.writeFileSync(path.join(targetDir, `${file.name}.html`), html);
  });
})();
