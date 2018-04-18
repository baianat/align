const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const { version } = require('../package.json');

module.exports = {
  script: {
    banner:
    `/**
    * v${version}
    * (c) ${new Date().getFullYear()} Baianat
    * @license MIT
    */`,
    paths: {
      umd: path.join(__dirname, '../src/js/align.js'),
      esm: path.join(__dirname, '../src/js/align.js'),
      src: path.join(__dirname, '../src/js'),
      dist: path.join(__dirname, '../dist/js')
    },
    uglifyOptions: {
      toplevel: true,
      compress: true,
      mangle: true
    },
    inputOptions: {
      plugins: [
        replace({ __VERSION__: version }),
        resolve(),
        babel({
          plugins: ['external-helpers']
        })
      ]
    }
  },
  style: {
    src: path.join(__dirname, '../src/stylus'),
    dist: path.join(__dirname, '../dist/css'),
    app: path.join(__dirname, '../src/stylus/app.styl'),
    theme: path.join(__dirname, '../src/stylus/theme.styl')
  },
  utils: {
    stats ({ path, code }) {
      const { size } = fs.statSync(path);
      const gzipped = gzipSize.sync(code);

      return `Size: ${filesize(size).padStart(9, ' ')} | Gzip: ${filesize(gzipped).padStart(9, ' ')}`;
    }
  }
};
