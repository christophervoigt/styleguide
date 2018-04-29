/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const chalk = require('chalk');
const browserSync = require('browser-sync').create();
const watch = require('node-watch');

// tasks
const runHTML = require('./html.build').run;
const rebuildHTML = require('./html.build').rebuild;
const runCSS = require('./css.build').run;
const rebuildCSS = require('./css.build').rebuild;
const runJS = require('./javascript.build').run;
const rebuildJS = require('./javascript.build').rebuild;
const runIMG = require('./image.build').run;
const rebuildIMG = require('./image.build').rebuild;
const runSTATIC = require('./static.build').run;
const rebuildSTATIC = require('./static.build').rebuild;

const srcFolder = 'src';
const distFolder = 'app';

(async () => {
  await runHTML();
  await runCSS();
  await runJS();
  await runIMG();
  await runSTATIC();

  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
    'Starting Browsersync...\n',
  );

  browserSync.init({
    server: { baseDir: distFolder },
    open: 'local',
  });

  // @ToDo: move watch tasks

  watch(srcFolder, {
    recursive: true,
    filter: /\.scss$/,
  }, async (event, name) => {
    await rebuildCSS(event, name);
    browserSync.reload();
  });

  watch(srcFolder, {
    recursive: true,
    filter: /\.pug$/,
  }, async (event, name) => {
    await rebuildHTML(event, name);
    browserSync.reload();
  });

  watch(srcFolder, {
    recursive: true,
    filter: /\.jpg$|\.png$|\.svg$|\.ico$/,
  }, async (event, name) => {
    await rebuildIMG(event, name);
    browserSync.reload();
  });

  watch(srcFolder, {
    recursive: true,
    filter: /\.js$/,
  }, async (event, name) => {
    await rebuildJS(event, name);
    browserSync.reload();
  });

  watch(srcFolder, {
    recursive: true,
    filter: /\.eot$|\.woff$|\.woff2$|\.ttf$|\.json$/,
  }, async (event, name) => {
    await rebuildSTATIC(event, name);
    browserSync.reload();
  });
})();
