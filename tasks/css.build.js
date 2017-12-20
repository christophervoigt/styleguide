const path = require('path');
const fs = require('fs');
const Cattleman = require('cattleman');
const sass = require('node-sass');
const importer = require('node-sass-tilde-importer');

const srcPath = 'src';
const distPath = 'dist';

(async () => {
  const srcPathDirs = srcPath.split('/');
  const outputStyle = process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded';
  const buildSourceMap = process.env.NODE_ENV !== 'production';

  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: ['base', 'styleguide'],
  });
  const modules = cattleman.gatherFiles('.scss');

  await Promise.all(modules.map(async (module) => {
    const file = path.parse(module);

    const moduleDirs = file.dir.split(path.sep);
    const targetDirs = moduleDirs.splice(srcPathDirs.length, moduleDirs.length);
    const targetPath = path.normalize(targetDirs.join(path.sep));
    const targetDir = path.join(distPath, targetPath);

    await sass.render({
      file: module,
      importer,
      outFile: path.join(targetDir, `${file.name}.css`),
      outputStyle,
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
})();
