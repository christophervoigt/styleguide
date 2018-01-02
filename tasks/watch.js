
const browserSync = require('browser-sync');
const watch = require('node-watch');

// tasks
const buildCSS = require('./css.build').build;
const buildHTML = require('./html.build').build;
const buildJS = require('./javascript.build').build;

const srcPath = 'src';

browserSync({
  server: {
    baseDir: 'app',
  },
  open: 'local',
});

watch(srcPath, {
  recursive: true,
  filter: /\.pug$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  // TODO: check if file is worth to be rebuild (no-mixins)
  buildHTML(name);
  browserSync.reload();
});

watch(srcPath, {
  recursive: true,
  filter: /\.js$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  // TODO: check if file is worth to be rebuild
  buildJS(name);
  browserSync.reload();
});

watch(srcPath, {
  recursive: true,
  filter: /\.scss$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  // TODO: check if file is worth to be rebuild (no-mixins)
  buildCSS(name);
  browserSync.reload();
});
