var gulp = require('gulp'),
    ndemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    ts = require('gulp-typescript');
    // runSequence = require('run-sequence');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    gulp.watch('app/**/*.ts', ['typescript']);
});

gulp.task('typescript' , function() {
    console.log('Compiling typescript');
    return gulp.src(['app/**/*.ts'])
        .pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy'))
});

gulp.task('serve', ['typescript'], function () {
    livereload.listen();
    ndemon({
        script: 'deploy/index.js',
        ext: 'js'
    }).on('restart', function () {
        setTimeout(function () {
            livereload.changed();
        }, 500);
    });
});


