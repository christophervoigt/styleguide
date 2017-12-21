
const browserSync = require('browser-sync');

browserSync({
  browser: 'google-chrome',
  server: {
    baseDir: 'app',
  },
});
