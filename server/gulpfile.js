var gulp = require('gulp'),
    ts = require('gulp-typescript');

gulp.task('typescript', function() {
    console.log('Compiling typescript');
    return gulp.src(['app/**/*.ts'])
        .pipe(ts({module: 'commonjs'})).js.pipe(gulp.dest('./deploy'))
});

gulp.task('default', ['typescript']);
