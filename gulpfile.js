/**
 * gulp modules
 */
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const svgSprite = require("gulp-svg-sprites");
const rollup = require('gulp-rollup');

const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

/**
 * browser Sync
 */
const browserSync = require('browser-sync');
const reload = browserSync.reload;


/**
 * Scripts task
 */
gulp.task('scripts', () => {
    gulp.src('./src/js/**/*.js')
        .pipe(plumber())
        .pipe(rollup({
            rollup: require('rollup'),
            entry: './src/js/editor.js',
            format: 'umd',
            moduleName: 'Editor',
            allowRealFiles: true,
            plugins: [
                nodeResolve(),
                commonjs(),
                buble()
            ]
        }))
        .pipe(rename({
            basename: "editor",
            suffix: "",
            extname: ".js"
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({ stream: true }));
});

/**
 * Styles task
 */
gulp.task('styles', function () {
    gulp.src('./src/stylus/app.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus({
            'include css': true,
            include: [
                './node_modules/../'
            ]
        }))
        .pipe(rename({
            basename: "editor",
            suffix: "",
            extname: ".css"
        }))
        .pipe(autoprefixer('last 5 version'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({ stream: true }));
});

/**
 * fonts task
 */
gulp.task('font', () => {
  gulp.src('./src/font/*')
    .pipe(gulp.dest('./dist/font/'));
});

/**
 * sprites task
 */
gulp.task('sprites', function () {
    return gulp.src('src/svg/*.svg')
        .pipe(svgSprite({
            preview: false,
            mode: "symbols",
            svgId: "icon-%f",
            svg: {
                sprite: "icons.svg"
            }
        }))
        .pipe(gulp.dest("dist"));
});


/**
 * Production scripts task
 */
gulp.task('production:scripts', function () {
    gulp.src('./src/**/*.js')
        .pipe(rollup({
            rollup: require('rollup'),
            entry: './src/js/editor.js',
            format: 'umd',
            moduleName: 'Editor',
            allowRealFiles: true,
            plugins: [
                nodeResolve(),
                commonjs(),
                buble()
            ]
        }))
        .pipe(rename({
            basename: "editor",
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


/**
 * production styles task
 */
 gulp.task('production:styles', function () {
    gulp.src('./src/stylus/editor.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(rename({
            basename: "editor",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest('./dist/css'));
     })

/**
 * production  task
 */
 gulp.task('production', ['styles', 'scripts', 'production:scripts', 'production:styles']);

 /**
  * Browser-sync task
  */
gulp.task('browser-sync', function () {
    browserSync.init({
       proxy: "editor.dev/index.html"
   });
})

/**
 * Watch task
 */
gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/stylus/**/*.styl', ['styles']);
    gulp.watch('./src/svg/**/*.svg', ['sprites']);
    gulp.watch('./**/*.html', function () {
        gulp.src('./**/*.html').pipe(reload({stream: true}));
    });
});

/**
 * Default task
 */
gulp.task('default', ['styles', 'scripts', 'font', 'browser-sync', 'sprites', 'watch']);
