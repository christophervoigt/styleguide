/* eslint no-console: "allow" */

const browserSync = require('browser-sync');
const watch = require('node-watch');
const chalk = require('chalk');

// tasks
const buildCSS = require('./css.build').build;
const buildHTML = require('./html.build').build;
const buildIMG = require('./image.build').build;
const buildJS = require('./javascript.build').build;

const srcPath = 'src';
let cssMap = {};
let jsMap = {};

browserSync({
  server: {
    baseDir: 'app',
  },
  open: 'local',
});

watch(srcPath, {
  recursive: true,
  filter: /\.jpg$|\.png$|\.ico$/,
}, (event, name) => {
  console.log('IMG: rebuilding', chalk.green(name));
  buildIMG(name);
  browserSync.reload();
});


watch(srcPath, {
  recursive: true,
  filter: /\.scss$/,
}, async (event, name) => {
  // TODO:
  // check if `name` should be build
  console.log('CSS: rebuilding', chalk.green(name));
  cssMap = await buildCSS(name);
  // end TODO

  const files = Object.keys(cssMap);
  files.forEach((file) => {
    const sources = cssMap[file];

    if (sources.includes(name)) {
      console.log('CSS: rebuilding', chalk.green(file));
      buildCSS(file);
    }
  });

  browserSync.reload();
});


watch(srcPath, {
  recursive: true,
  filter: /\.pug$/,
}, (event, name) => {
  // TODO:
  // check if `name` should be build
  console.log('HTML: rebuilding', chalk.green(name));
  htmlMap = buildHTML(name);
  // end TODO

  const files = Object.keys(htmlMap);
  files.forEach((file) => {
    const sources = htmlMap[file];

    if (sources.includes(name)) {
      console.log('HTML: rebuilding', chalk.green(file));
      buildHTML(file);
    }
  });

  browserSync.reload();
});


watch(srcPath, {
  recursive: true,
  filter: /\.js$/,
}, async (event, name) => {
  // TODO:
  // check if `name` should be build
  console.log('JS: rebuilding', chalk.green(name));
  jsMap = await buildJS(name);
  // end TODO

  const files = Object.keys(jsMap);
  files.forEach((file) => {
    const sources = jsMap[file];

    if (sources.includes(name)) {
      console.log('JS: rebuilding', chalk.green(file));
      buildJS(file);
    }
  });

  browserSync.reload();
});
