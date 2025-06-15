import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import cssnano from "cssnano";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import avif from "gulp-avif";
import plumber from "gulp-plumber";

const { src, dest, watch, series, parallel } = gulp;

const sassProcessor = gulpSass(dartSass);

function errorHandler(err) {
  console.error("Error en SCSS:", err.messageFormatted || err.message);
  this.emit("end");
}

function css(done) {
  src("src/scss/app.scss")
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sassProcessor())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
  done();
}

function cssProd(done) {
  src("src/scss/app.scss")
    .pipe(plumber({ errorHandler }))
    .pipe(sassProcessor())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("build/css"));
  done();
}

function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

function versionWebp() {
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 50 }))
    .pipe(dest("build/img"));
}

function versionAvif() {
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif({ quality: 50 }))
    .pipe(dest("build/img"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
}

// Para desarrollo local (con AVIF)
const desarrollo = series(imagenes, versionWebp, versionAvif, css, dev);

// Para producción/Netlify (sin AVIF)
const produccion = series(imagenes, versionWebp, cssProd);

export {
  css,
  cssProd,
  dev,
  imagenes,
  versionWebp,
  versionAvif,
  desarrollo,
  produccion,
  produccion as build,
  produccion as prod,
  desarrollo as default,
};