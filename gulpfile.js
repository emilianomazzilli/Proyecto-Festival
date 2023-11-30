const { src, dest, watch, parallel } = require('gulp');
 
//* src(source) sirve para identifica un archivo, sirve para guardarlo
//* dest es una función que nos va a permitir almacenar algo en una carpeta destino
 
//! Dependencias de Css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
//* Estos 3 juntos van a mejorar mucho el codigo
const autoprefixer = require('autoprefixer'); // El autoprefixer va a asegurarse que funcione en el navegador que tu le digas
const cssnano = require('cssnano');  // Css Nano va a comprimir nuestro codigo CSS.
const postcss = require('gulp-postcss'); // Post hace algunas transformaciones por el medio de estos dos
// Una vez terminado usar el Source maps para ahorrar recursos
const sourcemaps = require('gulp-sourcemaps');

//! Dependencia de Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
 
//! Dependecias de JavaScript
const terser = require('gulp-terser-js');

function css(done) {
  src('src/scss/**/*.scss') // Identificar el archivo SASS a compilar
    .pipe(sourcemaps.init()) // lo que va hacer va a ser inicializar tambien el sourcemaps ya que con la hoja de estilos(app.css) que tiene que compilar y de esa forma ir guardando la referencia.
    .pipe(plumber()) // En caso de que haya errores no detener todo el workflow
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.')) // Aca es la ubicacion donde se va guardar
    .pipe(dest('build/css')) // Almacenar en el disco duro
 
  done(); // Callback  que avisa a gulp cuando llegamos al final de la ejecución.
}
 
function imagenes(done) {
  //* Este código funciona para que todas las imagenes que tengas, pueda procesarlas todas para hacerla mas ligeras y que tu sitio Web tenga mejor puntaje en Google.
  const opciones = {
    optimizationLevel: 3,
  };
  src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'));
 
  done();
}
 
function versionWebp(done) {
  //* Esto es para que las imágenes carguen menos peso
  const opciones = {
    quality: 50,
  };
 
  src('src/img/**/*.{png,jpg}') //* Este código se va a encargar de buscar todas las imágenes que tengan esos 2 formatos
    .pipe(webp(opciones))
    .pipe(dest('build/img'));
 
  done();
}
 
function versionAvif(done) {
  //* Avif es la mas ligera
  const opciones = {
    quality: 50,
  };
 
  src('src/img/**/*.{png,jpg}').pipe(avif(opciones)).pipe(dest('build/img'));
 
  done();
}
 
function javascript(done) {
  src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
 
  done();
}
 
function dev(done) {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', javascript);
 
  done();
}
 
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
 
//* parallel lo que hace es que ejecuta las 2 al mismo tiempo, ya que es en paralelo.
 
//TODO: Una forma de compilar todos los archivos en scss es usando **/*.
//* Si vas a buscar 2 o mas formatos hay que ponerlo entre llaves /**/*.{};