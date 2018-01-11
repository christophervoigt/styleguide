const path = require('path');
const Cattleman = require('cattleman');
const imagemin = require('imagemin');


const srcPath = 'src';
const distPath = process.env.NODE_ENV === 'production' ? 'dist' : 'app';

async function build(module) {
  const srcPathDirs = srcPath.split('/');

  const file = path.parse(module);
  const moduleDirs = file.dir.split(path.sep);
  const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
  const targetPath = path.normalize(targetDirs.join(path.sep));
  const targetDir = path.join(distPath, targetPath);

  await imagemin([module], targetDir);
}

(async () => {
  const cattleman = new Cattleman(srcPath);
  const modules = cattleman.gatherFiles(['.jpg', '.png', '.ico']);

  await Promise.all(modules.map(async (module) => {
    await build(module);
  }));
})();

exports.build = build;
