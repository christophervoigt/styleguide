
const buildCSS = require('./css.build').build;
const buildHTML = require('./html.build').build;
const buildJS = require('./javascript.build').build;

const watch = require('node-watch');
const srcPath = 'src';

watch(srcPath, {
  recursive: true,
  filter: /\.pug$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildHTML(name);
});

watch(srcPath, {
  recursive: true,
  filter: /\.js$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildJS(name);
});

watch(srcPath, {
  recursive: true,
  filter: /\.scss$/,
}, (event, name) => {
  console.log(`rebuilding ${name}`);
  buildCSS(name);
});

// todo:
// trigger browsersync.reload after build
