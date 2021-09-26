const {watch, series, parallel, src, dest, lastRun } = require('gulp');
const sass = require('gulp-sass')(require("sass"));
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();
const prettify = require('gulp-prettify');
const del = require('del');

// 削除
const clean = (done) => {
  del('./dist/**/*');
  done();
};

// HTML整形
const htmlFormat = (done) => {
  src('./src/**/*.html')
    .pipe(
      prettify({
        indent_char: ' ',
        indent_size: 2,
        unformatted: ['a', 'span', 'br'],
      }),
    )
    .pipe(dest('./dist/'));
    done();
}

// sassコンパイル
const compileSass = (done) => {
  src('./src/assets/styles/*.scss')
    .pipe(
      sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
    )
    .pipe(dest("./dist/assets/styles"));
    done();
}

// 画像圧縮
const imageMin = (done) => {
    src('./src/assets/images/**/*.{jpg,jpeg,png,svg,gif}')
      .pipe(
        imagemin([
          pngquant({
            quality: [.60, .70], // 画質
            speed: 1 // スピード
          }),
          mozjpeg({ quality: 65 }), // 画質
          imagemin.svgo(),
          imagemin.optipng(),
          imagemin.gifsicle({ optimizationLevel: 3 }) // 圧縮率
        ])
      )
      .pipe(dest('./dist/assets/images'));
      done();
}

// ブラウザ更新
const initBrowsersync = (done) => {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: './dist',
      index: 'index.html',
    },
    reloadOnRestart: true,
    open: 'external',
  });
  done();
}

// ウォッチタスク
const watchFiles = (done) =>{
  const browserReload = () => {
    browserSync.reload();
    done();
  };

  // scssファイル変更時
  watch('./src/assets/styles/*.scss')
    .on('change', series(compileSass, browserReload))
  // scssファイル追加時
  watch('./src/assets/styles/*.scss')
    .on('add', series(compileSass, browserReload))
  // 画像ファイル追加時
  watch('./src/assets/images/*.{jpg,jpeg,png,svg,gif}')
    .on('add', series(imageMin, browserReload));
  // htmlファイル追加時
  watch('./src/**/*.html')
    .on('add', series(htmlFormat, browserReload));
  // htmlファイル変更時
  watch('./src/**/*.html')
    .on('change', series(htmlFormat, browserReload));

  // 画像、htmlファイル削除時
  watch([
    './src/assets/images/*.{jpg,jpeg,png,svg,gif}',
    './src/**/*.html'
    ])
    .on('unlink', (event) => {
      const path = event.replace('src', 'dist');
      del(path);
    });

  // scssファイル削除時
  watch('./src/assets/styles/*.scss')
    .on('unlink', (event) => {
      let path = event.replace('src', 'dist');
      path = path.replace('scss', 'css');
      del(path);
    });
}

// デフォルトタスク
exports.default = series(
  clean,
  parallel(compileSass, imageMin, htmlFormat),
  series(initBrowsersync, watchFiles),
);
