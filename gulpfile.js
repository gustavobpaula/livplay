'use strict';

var gulp        = require('gulp'),
	$           = require('gulp-load-plugins')(),
	del         = require('del'),
	path        = require('path'),
	browserSync = require('browser-sync'),
	sassLint    = require('gulp-sass-lint'),
	preprocess  = require('gulp-preprocess');

var paths = {
	scripts: 'src/scripts/**/*.js',
	styles: 'src/styles/**/*.scss',
	images: 'src/images/**/*.{png,jpeg,jpg,svg,gif}',
	fonts:  'src/fonts//**/*',
	html: 'src/*.html',
	extras: ['src/*.*', '!src/*.html'],
	dest: {
		scripts : 'dist/js',
		styles: 'dist/css',
		images: 'dist/img',
		fonts: 'dist/fonts',
		html: 'dist/html',
		extras: 'dist'
	}
};

gulp.task('lint', function () {
	return gulp.src(['src/scripts/app/*.js', 'src/scripts/app.js'])
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
});

gulp.task('sassLint', function () {

	return gulp.src(paths.styles.concat('!src/styles/base/*'))
		.pipe(sassLint({
				options: {
					'config-file': '.sass-lint.yml'
				}
			}))
		.pipe(sassLint.format());
});

gulp.task('html', function(){
	return gulp.src(paths.html)
		.pipe(preprocess({
			context: { PROD: $.util.env.production }
		}))
		.pipe(gulp.dest(paths.dest.extras));
});

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
		.pipe($.newer(paths.dest.fonts))
		.pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('scripts', ['lint'], function () {
	var file = 'app.min.js';

	return gulp.src(paths.scripts)
		.pipe($.plumber())
		.pipe($.newer(paths.dest.scripts + file))
		.pipe($.uglifyjs(file, {
			outSourceMap: !$.util.env.production,
			sourceRoot: '../'
		}))
		.pipe(gulp.dest(paths.dest.scripts));
});

gulp.task('styles', ['sassLint'], function () {
	return gulp.src(paths.styles)
		.pipe($.plumber())
		.pipe($.util.env.production ? $.util.noop() : $.sourcemaps.init() )
		.pipe($.sass({
			outputStyle: $.util.env.production ? 'compressed' : 'nested',
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest.styles));
});

gulp.task('images', function () {
	return gulp.src(paths.images)
		.pipe($.plumber())
		.pipe($.newer(paths.dest.images))
		.pipe($.imagemin({
			optimizationLevel: $.util.env.production ? 5 : 1,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(paths.dest.images));
});

gulp.task('extras', function () {
	return gulp.src(paths.extras, {base: 'src'})
		.pipe($.newer(paths.dest.extras))
		.pipe(gulp.dest(paths.dest.extras));
});

gulp.task('clean', function () {
	return del([paths.dest.extras]);
});

gulp.task('serve', ['watch'], function () {
	browserSync({
		files: [ 'dist/**', '!dist/**/*.map' ],
		server:{
			baseDir: ['dist','./']
		},
		open: !$.util.env.no
	});
});

gulp.task('watch', ['html', 'scripts', 'styles', 'images', 'fonts', 'extras'], function(){
	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch(paths.extras, ['extras']);
});

gulp.task('default', ['clean'], function () {
	gulp.start('serve');
});

gulp.task('deploy', ['clean'], function () {
	$.util.env.production = true;
	gulp.start(['html', 'scripts', 'styles', 'images', 'fonts', 'extras']);
});