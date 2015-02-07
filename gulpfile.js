var gulp = require('gulp');

function startExpressServer() {
	var express = require('express');
	var app = express();

	app.use(require('connect-livereload')());
	app.use(express.static(__dirname));
	app.listen(4000);
};

var lr;
function startLivereload() {
	lr = require('tiny-lr')();
	lr.listen(35729);
};

function notifyLivereload(event) {
	var fileName = require('path').relative(__dirname, event.path);
	lr.changed({
		body: {
			files: [fileName]
		}
	});
};

gulp.task('cssmin', function() {
	gulp.src('assets/css/*.css', {base: 'assets'})
		.pipe(require('gulp-minify-css')())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', function(){
	startExpressServer();
	startLivereload();
	gulp.watch('**/*', notifyLivereload);
});
