/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint global-require: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/no-dynamic-require: ["off", { allow: ["warn"] }] */

const chalk = require('chalk');
const browserSync = require('browser-sync').create();
const watch = require('node-watch');

// tasks
const rebuildHTML = require('./html.build').rebuild;
const rebuildCSS = require('./css.build').rebuild;
const rebuildJS = require('./javascript.build').rebuild;
const rebuildIMG = require('./image.build').rebuild;
const rebuildSTATIC = require('./static.build').rebuild;

const srcFolder = 'src';
const distFolder = 'app';

const tasks = ['html', 'css', 'javascript', 'image', 'static'];

(async () => {
  await Promise.all(tasks.map(async (task) => {
    const startTime = new Date().getTime();
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
      `Starting ${task}...`,
    );

    const { run } = require(`./${task}.build`);
    await run();

    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
      `Finished ${task} after ${chalk.blue(`${new Date().getTime() - startTime}ms`)}`,
    );
  }));

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
