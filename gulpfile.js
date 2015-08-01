var gulp = require("gulp");
var livereload = require("gulp-livereload");
var concat = require("gulp-concat");

var paths = {
  scripts: ['./src/javascripts/*.js', './src/javascripts/**/*.js']
};

gulp.task("default", [], function () {
    return gulp.src(paths.scripts)
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest("./public/javascripts/"))
});

gulp.task("watch", function () {
    gulp.watch("./src/javascripts/*.js", ["default"]);
    gulp.watch("./src/javascripts/**/*.js", ["default"]);
});
