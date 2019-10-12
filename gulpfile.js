//
// Gulpfile
//

const {src, dest, parallel, watch, series} = require('gulp'),
    del = require('del'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ejs = require('gulp-ejs'),
    browserSync = require('browser-sync').create();


function html() {
    return src('src/*.ejs')
        .pipe(ejs({}))
        .pipe(rename({ extname: '.html' }))
        .pipe(dest('dist/'))
}

function scss() {
    return src('src/assets/scss/*.scss')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer([
            "last 1 major version",
            ">= 1%",
            "Chrome >= 45",
            "Firefox >= 38",
            "Edge >= 12",
            "Explorer >= 10",
            "iOS >= 9",
            "Safari >= 9",
            "Android >= 4.4",
            "Opera >= 30"], {cascade: true}))
        .pipe(dest('dist/assets/css'))
}

function serve() {
    browserSync.init({
        files: "./*.html",
        startPath: "./index.html",
        server: {
            baseDir: "./dist",
            routes: {},
            middleware: function (req, res, next) {
                if (/\.json|\.txt|\.html/.test(req.url) && req.method.toUpperCase() == 'POST') {
                    console.log('[POST => GET] : ' + req.url);
                    req.method = 'GET';
                }
                next();
            }
        }
    })
}

async function clean() {
    await del(['dist'])
}

// function js() {
//     return src('client/javascript/*.js', {sourcemaps: true})
//         .pipe(concat('app.min.js'))
//         .pipe(dest('build/js', {sourcemaps: true}))
// }
exports.build = series(clean, parallel(scss, html));

exports.default = function () {
    serve();
    watch('src/**/*.ejs', {ignoreInitial: false}, html);
    watch('src/assets/scss/**/*.scss', {ignoreInitial: false}, scss);
    watch('dist/**/*.*').on('change', browserSync.reload);
};

