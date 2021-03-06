require('coffee-script').register();

var gulp       = require('gulp'),
    merge      = require('merge2'),
    buffer     = require('vinyl-buffer'),
    rename     = require('gulp-rename'),
    foreach    = require('gulp-foreach'),
    debug      = require('gulp-debug'),
    uglify     = require('gulp-uglify'),
    source     = require('vinyl-source-stream'),
    jasmine    = require('gulp-jasmine'),
    babelify   = require('babelify'),
    babel      = require('gulp-babel'),
    benchmark  = require('gulp-bench'),
    typescript = require('gulp-typescript'),
    browserify = require('browserify');


var typescriptProject = typescript.createProject('tsconfig.json', { typescript: require('typescript') });

gulp.task('typescript', function() {
  var result = gulp
    .src('src/**/*.ts')
    .pipe(typescript(typescriptProject))

  return merge([
    result.dts.pipe(gulp.dest('dist')),
    result.js.pipe(gulp.dest('dist'))
  ]);
});

gulp.task('browserify', ['typescript'], function() {
  return browserify('dist/sonic.js', {standalone: 'Sonic', sourceType: 'module'})
    .transform(babelify)
    .bundle()
    .pipe(source('sonic.browser.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('uglify', ['browserify'], function (){
  return gulp
    .src('dist/sonic.browser.js')
    .pipe(uglify())
    .pipe(rename('sonic.browser.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('spec', function() {
  return gulp
    .src('spec/*.js')
    .pipe(jasmine({ includeStackTrace: true }));
});

gulp.task('perf', function () {
  return gulp
    .src('perf/**/*.coffee')
    .pipe(benchmark({defer: true}))
});

gulp.task('dist', ['uglify']);
gulp.task('default', ['dist'])

gulp.task('watch', function() {
  gulp.watch('src/*.ts', ['dist']);
})
