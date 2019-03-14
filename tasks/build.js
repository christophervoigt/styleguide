
const { performance } = require('perf_hooks');
const log = require('./utils/log');
const { execute } = require('./utils/execute');

async function build() {
  const startTime = performance.now();

  await (execute(['static', 'image', execute(['color', 'icon'], 'css'), 'html', 'javascript']))();

  const time = performance.now() - startTime;
  log.finish('build', time);
}

if (require.main === module) build();

exports.build = build;
