var tinyLr;
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var lr = require('tiny-lr');
var jshint = require('gulp-jshint');
var karma = require('karma').server;

var SCRIPTS = ['app/**/*.js'];
var CSS = ['assets/css/*.css', 'assets/css/**/*.css'];
var SASS = ['assets/sass/*.scss', 'assets/sass/**/*.scss'];
var HTML = ['index.html', 'app/**/*.html'];

function notifyLr(event) {
	tinyLr.changed({
		body: {
			files: [path.relative(__dirname, event.path)]
		}
	});
};
 
gulp.task('express', function() {
	var express = require('express');
	var app = express();

	app.use(require('connect-livereload')());
	app.use(express.static(__dirname));
	app.listen(4000);
});

gulp.task('livereload', function() {
	tinyLr = require('tiny-lr')();
	tinyLr.listen(35729);
});

gulp.task('tdd', function(cb) {
	karma.start({
		configFile: __dirname + '/karma.conf.js'
	}, cb);
});

gulp.task('jshint', function() {
	gulp.src(SCRIPTS)
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
			//.pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {	
	gulp.watch(SASS, ['styles']);
	gulp.watch(HTML, notifyLr);
	gulp.watch(CSS, notifyLr);
	gulp.watch(SCRIPTS, ['jshint']);
});

gulp.task('styles', function() {
	gulp.src(SASS)
		.pipe(sass())
		.pipe(gulp.dest('assets/css'));
});

gulp.task('default', ['tdd', 'styles', 'express', 'livereload', 'watch'], function(){});
gulp.task('serve', ['default'], function() {});
