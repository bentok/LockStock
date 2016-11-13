const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['copyImages', 'copySounds', 'copyMusic', 'copyMaps', 'copyVendorAssets', 'browserify']);

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', ['browserify']);
});

// Copy images to public
gulp.task('copyImages', () => gulp.src('src/images/**/*.*')
  .pipe(gulp.dest('public/images')));

// Copy sounds to public
gulp.task('copySounds', () => gulp.src('src/sounds/**/*.*')
  .pipe(gulp.dest('public/sounds')));

// Copy music to public
gulp.task('copyMusic', () => gulp.src('src/music/**/*.*')
  .pipe(gulp.dest('public/music')));

  // Copy images to public
gulp.task('copyMaps', () => gulp.src('src/maps/**/*.*')
  .pipe(gulp.dest('public/maps')));

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
    'node_modules/phaser/build/phaser.min.js',
  ]).pipe(gulp.dest('public/vendor'));
});
