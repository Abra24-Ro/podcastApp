import gulp from "gulp";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import cssnano from "cssnano";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import avif from "gulp-avif";
import plumber from "gulp-plumber"; // 🛠️ Importar plumber

const { src, dest, watch, series, parallel } = gulp;

const sassProcessor = gulpSass(dartSass);

// 🧯 Función de manejo de errores
function errorHandler(err) {
  console.error("❌ Error en SCSS:", err.messageFormatted || err.message);
  this.emit("end");
}

// 🧵 Compilar SCSS con manejo de errores
function css(done) {
  src("src/scss/app.scss")
    .pipe(plumber({ errorHandler })) // 🚨 Aquí evitamos que Gulp se caiga
    .pipe(sourcemaps.init())
    .pipe(sassProcessor())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
  done();
}

// 👕 CSS para producción (sin sourcemaps)
function cssProd(done) {
  src("src/scss/app.scss")
    .pipe(plumber({ errorHandler })) // También lo incluimos por si acaso
    .pipe(sassProcessor())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("build/css"));
  done();
}

// 🖼️ Optimizar imágenes
function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

// 🌐 Convertir a WebP
function versionWebp() {
  return src("src/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 50 }))
    .pipe(dest("build/img"));
}

// 🌐 Convertir a AVIF
function versionAvif() {
  return src("src/img/**/*.{png,jpg}")
    .pipe(avif({ quality: 50 }))
    .pipe(dest("build/img"));
}

// 👁️ Escuchar cambios en SCSS e imágenes
function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
}

// 🚀 Tareas principales
const desarrollo = series(imagenes, versionWebp, versionAvif, css, dev);
const produccion = series(imagenes, versionWebp, versionAvif, cssProd);
const produccionParalelo = parallel(series(imagenes, versionWebp, versionAvif), cssProd);

// 🧭 Exports
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
  produccion as prod,# Node modules
  node_modules/
  
  # Build output
  build/
  
  # Logs
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  
  # OS generated files
  .DS_Store
  Thumbs.db
  
  # Gulp cache (si usas caché en algún plugin)
  .cache/
  
  # Sourcemaps (si no los necesitas en producción)
  *.map
  
  desarrollo as default,
};
