const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['copyImages', 'copyVendorAssets', 'browserify']);

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', ['browserify']);
});

// Compile less
gulp.task('less', () => gulp.src('src/**/*.less')
  .pipe(less())
  .pipe(gulp.dest('public')));

// Copy images to public
gulp.task('copyImages', () => gulp.src('src/images/*.*')
  .pipe(gulp.dest('public/images')));

// Applies transforms to Javascript and bundles it
gulp.task('browserify', () => {
  return browserify({
    entries: [
      'src/game.js'
    ]
  })
  .transform('babelify', {
    'presets': ['es2015']
  })
  .bundle()
  .pipe(source('main.bundle.js'))
  .pipe(gulp.dest('public/js'));
});

gulp.task('copyVendorAssets', () => {
   return gulp.src([
     'node_modules/phaser/build/phaser.min.js'
   ])
   .pipe(gulp.dest('public/vendor'));
});
