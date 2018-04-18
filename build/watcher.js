const { style, script } = require('./config');
const { buildStyles } = require('./styles');
const { buildScripts } = require('./scripts');
const bs = require('browser-sync').create();

bs.init({
  server: true,
  files: [
    script.paths.dist,
    style.dist, {
      match: script.paths.src,
      fn (event, file) {
        buildScripts();
      }
    }, {
      match: style.src,
      fn (eventType, filename) {
        buildStyles();
      }
    }
  ]
});
