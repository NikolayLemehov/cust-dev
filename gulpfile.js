"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
// const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');


gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task('scripts', function () {
  return gulp.src('./source/js/main.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('build/js/'));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("copypngjpg", "html", "refresh"));
  gulp.watch("source/layout/*.{png,jpg}", gulp.series("copy-layout", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/*.html",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copysvg", function () {
  return gulp.src([
    "source/img/**/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copypngjpg", function () {
  return gulp.src([
    "source/img/**/*.{png,jpg}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copy-layout", function () {
  return gulp.src([
    "source/**/*.{png,jpg}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("clean-js", function () {
  return del(["build/js/**", "!build/js/bundle.js", "!build/js/bundle.js.map"]);
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "copy-layout",
  "scripts",
  "clean-js",
));

gulp.task("start", gulp.series("build", "server"));
