var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    ts = require('gulp-typescript'),
    mocha = require('gulp-mocha');

gulp.task('typescript' , function() {
    console.log('Compiling typescript');
    return gulp.src('app/**/*.ts')
        .pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy/app'))
});

gulp.task('typescript-watch', function() {
    gulp.watch('app/**/*.ts', ['typescript']);
});

gulp.task('serve', ['typescript-watch'], function () {
    nodemon({
        script: 'deploy/index.js',
        ext: 'js',
        nodeArgs: ['--debug']
    });
});

gulp.task('test-typescript' , function() {
    console.log('Compiling typescript');
    return gulp.src('test/**/*.ts')
        .pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy/test'))
});

gulp.task('test-run', ['test-typescript'], function() {
    return gulp
        .src('./deploy/test/**/*.js')
        .pipe(mocha());
});

gulp.task('default', ['typescript-watch']);

