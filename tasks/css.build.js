const path = require('path');
const fs = require('fs');
const Cattleman = require('cattleman');
const shell = require('shelljs');
const sass = require('node-sass');
const importer = require('node-sass-tilde-importer');


const srcPath = 'src';
const distPath = 'dist';

async function build(module) {
  const srcPathDirs = srcPath.split('/');
  const outputStyle = process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded';
  const buildSourceMap = process.env.NODE_ENV !== 'production';

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
      if (!fs.existsSync(targetDir)) { shell.mkdir('-p', targetDir); }

      fs.writeFileSync(path.join(targetDir, `${file.name}.css`), result.css);

      if (buildSourceMap) {
        fs.writeFileSync(path.join(targetDir, `${file.name}.css.map`), result.map);
      }
    }
  });
}

(async () => {
  const cattleman = new Cattleman({
    directory: srcPath,
    excludes: ['base', 'styleguide'],
  });
  const modules = cattleman.gatherFiles('.scss');

  const base = path.join('src', 'base', 'base.scss');
  const styleguide = path.join('src', 'styleguide', 'styleguide.scss');
  modules.push(base, styleguide);

  await Promise.all(modules.map(async (module) => {
    await build(module);
  }));
})();

exports.build = build;
