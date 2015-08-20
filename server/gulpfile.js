var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    ts = require('gulp-typescript');

gulp.task('typescript' , function() {
    console.log('Compiling typescript');
    return gulp.src(['app/**/*.ts'])
        .pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy'))
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

gulp.task('default', ['typescript-watch']);

