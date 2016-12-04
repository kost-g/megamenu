var gulp        = require('gulp'),//Gulp connection
	sass        = require('gulp-sass'), //Подключаем Sass пакет
	browserSync = require('browser-sync'),// Browser Sync(livereloader) connection
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
    concatCss   = require('gulp-concat-css'); // Подключаем библиотеку для объединения css файлов
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('app/sass/main.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});
gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/owl-carousel/owl-carousel/owl.carousel.min.js',
		'app/libs/jquery-mousewheel/jquery-mousewheel.min.js',
		'app/libs/bxslider-4-master/dist/jquery.bxslider.min.js'
        ])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/bootstrap/dist/css/bootstrap.min.css',
		'app/libs/bxslider-4-master/dist/jquery.bxslider.min.css',
		// 'app/libs/owl-carousel/owl-carousel/owl-carousel.css',
        'app/libs/normalize-css/normalize.css'
        ])
        .pipe(concatCss("libs.min.css"))// Собираем их в кучу в новом файле libs.min.css
		.pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('prefix', function(){ 
    return gulp.src('app/css/*.css') // Берем источник
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'prefix'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/css/*.css', browserSync.reload); // Наблюдение за CSS файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});