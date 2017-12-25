
const browserSync = require('browser-sync');
const watch = require('node-watch');

// tasks
const buildCSS = require('./css.build').build;
const buildHTML = require('./html.build').build;
const buildJS = require('./javascript.build').build;

const srcPath = 'src';

browserSync({
  browser: 'google-chrome',
  server: {
    baseDir: 'app',
  },
});

watch(srcPath, {
  recursive: true,
  filter: /\.pug$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildHTML(name);
  browserSync.reload();
});

watch(srcPath, {
  recursive: true,
  filter: /\.js$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildJS(name);
  browserSync.reload();
});

watch(srcPath, {
  recursive: true,
  filter: /\.scss$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildCSS(name);
  browserSync.reload();
});
