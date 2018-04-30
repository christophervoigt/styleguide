/* eslint no-console: ["off", { allow: ["warn"] }] */
/* eslint global-require: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/no-dynamic-require: ["off", { allow: ["warn"] }] */

const chalk = require('chalk');
const browserSync = require('browser-sync').create();
const watch = require('node-watch');

// @ToDo: find a more generic approach
const rebuildHTML = require('./html.build').rebuild;
const rebuildCSS = require('./css.build').rebuild;
const rebuildJS = require('./javascript.build').rebuild;
const rebuildIMG = require('./image.build').rebuild;
const rebuildSTATIC = require('./static.build').rebuild;

const srcFolder = 'src';
const distFolder = 'app';
const tasks = ['html', 'css', 'javascript', 'image', 'static'];

function formatTime(time = 0) {
  let timeString = `${time}ms`;

  if (time > 1000) {
    timeString = `${Number((time / 1000).toFixed(3))}s`;
  } else if (time > (1000 * 60)) {
    timeString = `${Number((time / (1000 * 60)).toFixed(2))}m`;
  }

  return timeString;
}

function startBrowserSync() {
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString('de-DE'))}]`,
    'Starting Browsersync...\n',
  );
  browserSync.init({
    server: { baseDir: distFolder },
    open: 'local',
  });
}

function startWatchTask() {
  // @ToDo: find a more generic approach

  // watch(srcFolder, {
  //   recursive: true,
  //   filter: /\.scss$/,
  // }, async (event, name) => {
  //   await rebuildCSS(event, name);
  //   browserSync.reload();
  // });

  browserSync.watch('src/**/*.scss', async (event, file) => {
    await rebuildCSS(event, file);
    browserSync.reload();
  });

  // watch(srcFolder, {
  //   recursive: true,
  //   filter: /\.pug$/,
  // }, async (event, name) => {
  //   await rebuildHTML(event, name);
  //   browserSync.reload();
  // });

  browserSync.watch('src/**/*.pug', async (event, file) => {
    await rebuildHTML(event, file);
    browserSync.reload();
  });

  // watch(srcFolder, {
  //   recursive: true,
  //   filter: /\.js$/,
  // }, async (event, name) => {
  //   await rebuildJS(event, name);
  //   browserSync.reload();
  // });

  browserSync.watch('src/**/*.js', async (event, file) => {
    await rebuildJS(event, file);
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
    filter: /\.eot$|\.woff$|\.woff2$|\.ttf$|\.json$/,
  }, async (event, name) => {
    await rebuildSTATIC(event, name);
    browserSync.reload();
  });
}

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
      `Finished ${task} after ${chalk.blue(formatTime(new Date().getTime() - startTime))}`,
    );
  }));

  startBrowserSync();
  startWatchTask();
})();
