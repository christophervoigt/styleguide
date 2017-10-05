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

  await Promise.all(modules.map(async (module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));

    await sass.render({
      file: module,
      outFile: path.join(targetPath, `${file.name}.css`),
      outputStyle: 'compressed',
      sourceMap: true,
    }, (error, result) => {
      if (!error) {
        fs.writeFile(path.join(targetPath, `${file.name}.css`), result.css);
      }
    });
  }));
}

(async () => {
  await build();
})();
