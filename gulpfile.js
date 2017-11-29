const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const autoprefixer = require('gulp-autoprefixer');
const image = require('gulp-image');

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: './dist'
    });
    gulp.watch('src/*.html', ['html', 'build']);
    gulp.watch('src/styles/**/*.scss', ['sass', 'inject']);
    gulp.watch('src/scripts/**/*.js', ['js', 'inject']);
    gulp.watch('src/**/*.json', ['json']);
    gulp.watch('src/media/**/*.{png,jpeg,gif,svg}', ['image']);
});

gulp.task('build', function(callback) {
    runSequence('clean', 'html', 'sass', 'js', 'json', 'inject', 'image', callback);
});

gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

gulp.task('image', function() {
    return gulp.src('./src/media/**/*.{png,jpeg,gif,svg}')
        .pipe(image())
        .pipe(gulp.dest('./dist/media'));
})

gulp.task('sass', function() {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src('./src/scripts/**/*.js')
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

gulp.task('json', function() {
    return gulp.src('./src/scripts/**/*.json')
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
})

gulp.task('inject', function() {
    return gulp.src('./dist/*.html')
        .pipe(inject(gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false}), {relative: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function() {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

gulp.task('default', ['serve']);