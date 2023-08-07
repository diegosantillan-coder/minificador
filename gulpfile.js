const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const { src, series, parallel, dest, watch} = require('gulp');

const jsPath = 'app/js/*.js';
const cssPath = 'app/css/*.css';


function optimizeImages() {
  return src('app/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

gulp.task('optimizeImages', optimizeImages);

function copyHtml() {
  return src('app/*.html').pipe(gulp.dest('dist'));
}

function minifyJs() {
  return src(jsPath)
    .pipe(sourcemaps.init())
    //.pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'));
}

function minifyCss() {
  return src(cssPath)
    .pipe(sourcemaps.init())
    //.pipe(concat('styles.css'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}


function watchTask() {
  watch([cssPath, jsPath], {interval: 1000}, parallel(minifyCss, minifyJs));
};


exports.optimizeImages = optimizeImages;
exports.default = copyHtml;
exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;

exports.default = series(parallel(optimizeImages,copyHtml, minifyJs, minifyCss), watchTask);
