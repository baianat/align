/**
 * gulp modules
 */
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const rollup = require('gulp-rollup');
const sequence = require('gulp-sequence');

const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const del = require('del');
const svgSprite = require('gulp-svg-sprites');

const browserSync = require('browser-sync');
const reload = browserSync.reload;

let env = 'dev'

function isProduction() {
  return env === 'production';
};

/**
 * Browser-sync task
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'align.dev'
  });
})

/**
 * styles task
 */
gulp.task('styles', () => {
  return gulp.src('src/stylus/app.styl')
    .pipe(plumber())
    .pipe(stylus({
      'include css': true,
      compress: isProduction()
    }))
    .pipe(autoprefixer('last 5 version'))
    .pipe(rename({
      basename: 'align',
      suffix: isProduction() ? '.min' : '',
      extname: '.css'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({ stream: true }));
});

/**
 * Scripts task
 */
gulp.task('scripts', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(rollup({
      input: 'src/js/align.js',
      format: 'umd',
      name: 'Align',
      allowRealFiles: true,
      plugins: [
        nodeResolve(),
        commonjs(),
        buble()
      ]
    }))
    .pipe(rename({
      basename: 'align',
      suffix: isProduction() ? '.min' : '',
      extname: '.js'
    }))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({ stream: true }));
});

/**
 * Clean task
 * remove dist folders from all projects
 */
gulp.task('clean', () => del('dist'));

gulp.task('changeEnv', () => { env = 'production' });

gulp.task('production', sequence(
  'clean',
  ['styles', 'scripts'],
  'changeEnv',
  ['styles', 'scripts']
));

/**
 * fonts task
 */
gulp.task('font', () => {
  gulp.src('src/font/*/**')
    .pipe(gulp.dest('./dist/font/'));
});

/**
 * sprites task
 */
gulp.task('sprites', function () {
  return gulp.src('src/svg/*.svg')
    .pipe(svgSprite({
      preview: false,
      mode: 'symbols',
      svgId: 'icon-%f',
      svg: {
        sprite: 'icons.svg'
      }
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * Watch task
 */
gulp.task('watch', () => {
  gulp.watch('./src/js/**/*.js', ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['styles']);
  gulp.watch('./src/svg/**/*.svg', ['sprites']);
  gulp.watch('./**/*.html', () => {
    gulp.src('./**/*.html').pipe(reload({ stream: true }));
  });
});

/**
 * Default task
 */
gulp.task('default', ['styles', 'scripts', 'font', 'browser-sync', 'sprites', 'watch']);



