/* eslint global-require: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/no-dynamic-require: ["off", { allow: ["warn"] }] */

const browserSync = require('browser-sync').create();
const watch = require('node-watch');
const logger = require('./utils/logger');

const srcFolder = 'src';
const distFolder = 'app';
const tasks = ['html', 'css', 'javascript', 'image', 'static'];

function startBrowserSync() {
  logger.start('Browsersync');

  browserSync.init({
    server: { baseDir: distFolder },
    open: 'local',
  });
}

function startWatchTask() {
  const rebuildHTML = require('./html.build').rebuild;
  const rebuildCSS = require('./css.build').rebuild;
  const rebuildJS = require('./javascript.build').rebuild;
  const rebuildIMG = require('./image.build').rebuild;
  const rebuildSTATIC = require('./static.build').rebuild;

  watch(srcFolder, { recursive: true }, async (event, name) => {
    if (/\.pug$/.test(name)) {
      await rebuildHTML(event, name);
    } else if (/\.scss$/.test(name)) {
      await rebuildCSS(event, name);
    } else if (/\.js$/.test(name)) {
      await rebuildJS(event, name);
    } else if (/\.jpg$|\.png$|\.svg$|\.ico$/.test(name)) {
      await rebuildIMG(event, name);
    } else if (/\.eot$|\.woff$|\.woff2$|\.ttf$|\.json$/.test(name)) {
      await rebuildSTATIC(event, name);
    }

    browserSync.reload();
  });
}

(async () => {
  await Promise.all(tasks.map(async (task) => {
    const startTime = new Date().getTime();
    logger.start(task);

    const { run } = require(`./${task}.build`);
    await run();

    const time = new Date().getTime() - startTime;
    logger.finish(task, time);
  }));

  startBrowserSync();
  startWatchTask();
})();
