var gulp = require('gulp');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var stylus = require('gulp-stylus');
var nib = require('nib');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var inject = require('gulp-inject');
var wiredep =  require('wiredep').stream;
var templateCache = require('gulp-angular-templatecache');

var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');

var uncss = require('gulp-uncss');

gulp.task('inject', function() {
	var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);
	return gulp.src('index.html', {cwd: './app'})
		.pipe(inject(sources, {
			read: false,
			ignorePath: '/app'
		}))
		.pipe(gulp.dest('./app'));
});

gulp.task('wiredep', function() {
	gulp.src('./app/index.html')
		.pipe(wiredep({
			directory: './app/lib'
		}))
		.pipe(gulp.dest('./app'));
});


gulp.task('server', function() {
	connect.server({
		root: './app',
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function(connect, opt) {
			return [historyApiFallback];
		}
	});
});


gulp.task('css', function() {
	console.log('inicio CSS');
	gulp.src('./app/stylesheets/main.styl')
		.pipe(stylus({use: nib()}))
		.pipe(gulp.dest('./app/stylesheets'))
		.pipe(connect.reload());
});

gulp.task('html', function() {
	console.log('inicio HTML');
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

gulp.task('jshint', function() {
	console.log('Iniciando Jshint');
	return gulp.src('./app/scripts/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('templates', function() {
	gulp.src('./app/views/**/*.tpl.html')
		.pipe(templateCache({
			root: 'views/',
			module: 'blog.templates',
			standalone: true
		}))
		.pipe(gulp.dest('./app/scripts'));
});

gulp.task('compress', function() {
	gulp.src('./app/index.html')
		.pipe(useref.assets())
		.pipe(gulpif('*.js', uglify( { mangle: false })))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
	gulp.watch(['./app/scripts/**/*.js', 'gulpfile.js'], ['jshint', 'inject']);
	gulp.watch(['./bower.json'],['wiredep']);
});

gulp.task('copy', function() {
	gulp.src('./app/index.html')
		.pipe(useref())
		.pipe(gulp.dest('./dist'));
	gulp.src('./app/lib/fontawesome/fonts/**')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('server-dist', function() {
	connect.server({
		root: './dist',
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function(connect, opt) {
			return [historyApiFallback];
		}
	});
});

gulp.task('uncss', function() {
	gulp.src('./dist/css/style.min.css')
		.pipe(uncss({
			html: ['./app/index.html', './app/views/post-detail.tpl.html', './app/views/post-list.tpl.html']
		}))
		.pipe(gulp.dest('./dist/css'));

});


gulp.task('default', ['server', 'inject', 'wiredep' ,'watch']);
gulp.task('build', ['templates', 'compress', 'copy', 'uncss']);


