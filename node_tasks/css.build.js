const path = require('path');
const fs = require('fs');
const sass = require('node-sass');


const Cattleman = require('cattleman');

async function build() {
  // configure srcPath if necessary
  const srcPath = 'src';
  const srcPathDirs = srcPath.split('/');

  const cattleman = new Cattleman(srcPath);
  const modules = cattleman.gatherFiles('.scss');

  const buildSourceMap = process.env.NODE_ENV !== 'production';

  await Promise.all(modules.map(async (module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));
    const targetDir = path.join('dist', targetPath);

    await sass.render({
      file: module,
      outFile: path.join(targetDir, `${file.name}.css`),
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
      sourceMap: buildSourceMap,
    }, (error, result) => {
      if (!error) {
        if (!fs.existsSync(targetDir)) { fs.mkdirSync(targetDir); }

        fs.writeFileSync(path.join(targetDir, `${file.name}.css`), result.css);

        if (buildSourceMap) {
          fs.writeFileSync(path.join(targetDir, `${file.name}.css.map`), result.map);
        }
      }
    });
  }));
}

(async () => {
  await build();
})();
