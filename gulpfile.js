'use strict';

var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clearJs', function () {
    return gulp.src(['./dist', './.tmp'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('contactJs', ['clearJs'], function () {
    return gulp.src('./auth/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('aaj.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minJs', ['contactJs'], function () {
    return gulp.src('./dist/*.js')
        .pipe(sourcemaps.init())
        .pipe(jsmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch(['./auth/**/*.js'], ['minJs']);
});

gulp.task('default', ['watch', 'minJs']);