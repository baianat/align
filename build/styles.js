const fs = require('fs');
const chalk = require('chalk');
const stylus = require('stylus');
const path = require('path');
const uglifycss = require('uglifycss');
const autoprefixer = require('autoprefixer-stylus');

const { style, utils } = require('./config');

const isProduction = process.env.MODE === 'production';

function buildStyles () {
  console.log(chalk.cyan('📦  Generating Stylesheets...'));
  const app = fs.readFileSync(style.app, 'utf8');
  const theme = fs.readFileSync(style.theme, 'utf8');
  stylusToCSS(app, 'align');
  stylusToCSS(theme, 'default-theme');
}

function stylusToCSS (styl, name) {
  stylus(styl)
    .include(style.src)
    .use(autoprefixer({ browsers: ['last 5 version'] }))
    .render((err, css) => {
      if (err) {
        throw err;
      }
      const filePath = path.join(style.dist, `${name}.css`);
      let stats = isProduction ? utils.stats({ path: filePath, code: css }) : '';
      console.log(`${chalk.green(`👍  ${name}.css`.padEnd(25, ' '))} ${stats}`);
      fs.writeFileSync(filePath, css);

      if (!isProduction) return;
      const minPath = path.join(style.dist, `${name}.min.css`);
      const uglifiedCss = uglifycss.processString(css);
      stats = utils.stats({ path: minPath, code: uglifiedCss });
      console.log(`${chalk.green(`👍  ${name}.min.css`.padEnd(25, ' '))} ${stats}`);
      fs.writeFileSync(minPath, uglifiedCss);
    });
}

module.exports = { buildStyles };

buildStyles();
