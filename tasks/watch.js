/* eslint global-require: ["off", { allow: ["warn"] }] */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint import/no-dynamic-require: ["off", { allow: ["warn"] }] */

const browserSync = require('browser-sync').create();
const watch = require('node-watch');
const log = require('./utils/log');

const { build } = require('./build');

const rebuildICON = require('./build/icon').rebuild;
const rebuildCOLOR = require('./build/color').rebuild;
const rebuildHTML = require('./build/html').rebuild;
const rebuildCSS = require('./build/css').rebuild;
const rebuildJS = require('./build/javascript').rebuild;
const rebuildIMG = require('./build/image').rebuild;
const rebuildSTATIC = require('./build/static').rebuild;

const srcFolder = 'src';
const distFolder = 'app';

function mockPostRequests(req, res, next) {
  if (/\.json|\.html/.test(req.url) && req.method.toUpperCase() === 'POST') {
    req.method = 'GET';
  }
  next();
}

function startBrowserSync() {
  log.start('Browsersync');

  browserSync.init({
    server: {
      baseDir: distFolder,
    },
    middleware: mockPostRequests,
  });
}

function startWatchTask() {
  watch(srcFolder, { recursive: true }, async (event, name) => {
    // ToDo: rebuild to switch statement?

    if (/.font\.json$/.test(name)) {
      await rebuildICON(event, name);
    } else if (/.colors\.json/.test(name)) {
      await rebuildCOLOR(event, name);
    } else if (/\.pug$/.test(name)) {
      await rebuildHTML(event, name);
    } else if (/\.scss$/.test(name)) {
      await rebuildCSS(event, name);
    } else if (/\.js$/.test(name)) {
      await rebuildJS(event, name);
    } else if (/\.jpg$|\.png$|\.gif$|\.svg$|\.ico$/.test(name)) {
      await rebuildIMG(event, name);
    } else if (/\.eot$|\.woff$|\.woff2$|\.ttf$|\.json$/.test(name)) {
      await rebuildSTATIC(event, name);
    }

    browserSync.reload();
  });
}

(async () => {
  await build();

  startBrowserSync();
  startWatchTask();
})();
