
var gulp        = require('gulp'),//Gulp connection
	sass        = require('gulp-sass'), //Подключаем Sass пакет
	browserSync = require('browser-sync'),// Browser Sync(livereloader) connection
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
    concatCss   = require('gulp-concat-css'); // Подключаем библиотеку для объединения css файлов
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
    del         = require('del'); // Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'); // Подключаем библиотеку кеширования

//*******Преобразуем sass в css*******

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('app/sass/main.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

//*******Установка и запуск browser-sync*******

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

//*******Объединение и мимнимизация js бибилиотек*******

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

//*******Объединение и мимнимизация css, sass бибилиотек*******

gulp.task('css-libs', ['sass'], function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/bootstrap/dist/css/bootstrap.min.css',
		'app/libs/bxslider-4-master/dist/jquery.bxslider.min.css',
		'app/libs/owl-carousel/owl-carousel/owl.carousel.css',
        'app/libs/normalize-css/normalize.css'
        ])
        .pipe(concatCss("libs.min.css"))// Собираем их в кучу в новом файле libs.min.css
		.pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//*******Установка префиксов*******

gulp.task('prefix', function(){ 
    return gulp.src('app/css/*.css') // Берем источник
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

//*******Перенос и сжатие файлов на продакшен******

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

//*******Очистка папки dist******

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

//*******Объединение всего в одной функции******

gulp.task('build', ['clean', 'img'], function() {

    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/*.css'])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));
});

//*******Объединение все задач в один таск******

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'build'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/css/*.css', browserSync.reload); // Наблюдение за CSS файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

//*******Обистка кеша если проблемы с перенеосм изображений******

gulp.task('clear', function () {
    return cache.clearAll();
})

//*******Установка watch по умолчанию для вызова на функцию gulp ******

gulp.task('default', ['watch']);