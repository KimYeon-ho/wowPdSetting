const
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    wrapper = require('gulp-wrapper'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    inlinesource = require('gulp-inline-source'),
    fileinclude = require('gulp-file-include'),
    lec = require('gulp-line-ending-corrector'),
    htmlsplit = require('gulp-htmlsplit'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch');

let // txt 파일 kv, content 분할 여부
    isTxtDivision = true,
    // 상대경로
    _public = './public',
    _bin = _public + '/bin';

// html : AEM 버전으로 치환 후 복사
gulp.task('html:replace', () => {
    return gulp.src([_public + '/html/index.html', _public + '/html/script.html'])
        .pipe(replace('"./is/', '"//images.samsung.com/is/'))
        .pipe(replace('.jpg"', '?$ORIGIN_JPG$"'))
        .pipe(replace('.png"', '?$ORIGIN_PNG$&fmt=png-alpha"'))
        .pipe(rename({prefix: '_'}))
        .pipe(gulp.dest(_bin + '/html'))
});

// css : AEM 버전으로 치환 후 minify
gulp.task('css:minify', () => {
    return gulp.src(_public + '/css/*.css')
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('common.min.css'))
        .pipe(replace('../is/', '//images.samsung.com/is/'))
        .pipe(replace('.jpg', '?$ORIGIN_JPG$'))
        .pipe(replace('.png', '?$ORIGIN_PNG$&fmt=png-alpha'))
        .pipe(minify())
        .pipe(plumber.stop())
        .pipe(gulp.dest(_bin + '/css'))
});

// js : AEM 버전으로 치환 후 minify
gulp.task('js:uglify', () => {
    return gulp.src(_public + '/js/*.js') // src 폴더 모든 js 파일을
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(replace('isAEM = false', 'isAEM = true'))
        .pipe(concat('js.min.js')) // all.js 라는 파일명으로 병합
        // .pipe(wrapper({
        //     header: ';(function(win,doc,callback){\'use strict\';callback=callback||function(){};function detach(){if(doc.addEventListener){doc.removeEventListener(\'DOMContentLoaded\',completed);}else{doc.detachEvent(\'onreadystatechange\',completed);}}function completed(){if(doc.addEventListener||event.type===\'load\'||doc.readyState===\'complete\'){detach();callback(window,window.jQuery);}}function init(){if (doc.addEventListener){doc.addEventListener(\'DOMContentLoaded\',completed);}else{doc.attachEvent(\'onreadystatechange\',completed);}}init();})(window,document,function(win,$){',
        //     footer: '});'
        // }))
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest(_bin + '/js'))
});

// css|js : inline 형식으로 치환
gulp.task('html:inline', ['html:replace', 'css:minify', 'js:uglify'], () => {
    let _bin = _public + '/bin/html';
    return gulp.src([_bin + '/_index.html', _bin + '/_script.html'])
        .pipe(htmlreplace({
            css: {
                src: '../css/common.min.css',
                tpl: '<link rel="stylesheet" href="%s" inline>'
            },
            js: {
                src: '../js/js.min.js',
                tpl: '<script src="%s" inline></script>'
            }
        }))
        .pipe(inlinesource({
            compress: false
        }))
        .pipe(gulp.dest(_bin))
        .pipe(htmlsplit())
        .pipe(gulp.dest(_bin))
});

// 작업용 페이지 추출
gulp.task('extraction:local', () => {
    return gulp.src(_public + '/html/_layout.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rename('layout.html'))
        .pipe(gulp.dest(_public))
        .pipe(browserSync.reload({
            stream: true
        }))
});
// AEM 적용된 페이지 추출
gulp.task('extraction:aem', ['html:inline'], () => {
    return gulp.src(_public + '/html/_layout.html')
        .pipe(replace('@@include(\'', '@@include(\'_'))
        .pipe(gulp.dest(_bin + '/html'))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rename('layout_aem.html'))
        .pipe(gulp.dest(_public))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// AEM 전달용 txt 파일 추출 - kv
gulp.task('extraction:txt_kv', () => {
    let _bin = _public + '/bin/html',
        dirs = __dirname.split('/').slice(-1)[0];
    return gulp.src([_bin + '/_style.html', _bin + '/_kv.html'])
        .pipe(concat('html_feature_' + dirs + '_kv.txt'))
        .pipe(lec({
            eolc: 'CRLF',
            encoding: 'utf8'
        }))
        .pipe(gulp.dest(_public))
});

// AEM 전달용 txt 파일 추출 - content
gulp.task('extraction:txt_content', ['extraction:txt_kv'], () => {
    let _bin = _public + '/bin/html',
        dirs = __dirname.split('/').slice(-1)[0];
    return gulp.src([_bin + '/_content.html', _bin + '/_script.html'])
        .pipe(concat('html_feature_' + dirs + '_content.txt'))
        .pipe(lec({
            eolc: 'CRLF',
            encoding: 'utf8'
        }))
        .pipe(gulp.dest(_public))
});

// AEM 전달용 txt 파일 추출 - total
gulp.task('extraction:txt', () => {
    let _bin = _public + '/bin/html',
        dirs = __dirname.split('/').slice(-1)[0];
    return gulp.src([_bin + '/style.html', _bin + '/kv.html', _bin + '/content.html', _bin + '/script.html'])
        .pipe(wrapper({
            footer: '\n'
        }))
        .pipe(concat('html_feature_' + dirs + '.txt'))
        .pipe(lec({
            eolc: 'CRLF',
            encoding: 'utf8'
        }))
        .pipe(gulp.dest(_public))
});

/**
 * 웹서버 실행
 */
gulp.task('server:src', ['extraction:local'], () => {
    return browserSync.init({
        open: 'external',
        server: {
            baseDir: _public,
            index: 'layout.html'
        }
    });
});

gulp.task('server:dist', ['extraction:aem'], () => {
    return browserSync.init({
        open: 'external',
        server: {
            baseDir: _public,
            index: 'layout_aem.html'
        }
    });
});

/**
 * 파일변경 감지
 */
let reloadFunc = () => gulp.src(_public + '/layout.html').pipe(browserSync.reload({stream: true}));
gulp.task('watch:src', () => {
    gulp.watch(_public + '/html/*.html', ['extraction:local']);
    gulp.watch(_public + '/css/*.css', reloadFunc);
    gulp.watch(_public + '/js/*.js', reloadFunc);
    watch(_public + '/is/**/*', reloadFunc);
});
gulp.task('watch:dist', () => {
    gulp.watch(_public + '/html/*.html', ['extraction:aem']);
    gulp.watch(_public + '/css/*.css', ['extraction:aem']);
    gulp.watch(_public + '/js/*.js', ['extraction:aem']);
    watch(_public + '/is/**/*', ['extraction:aem']);
});

/**
 * 명령어
 */
let extractionTxt = isTxtDivision ? 'extraction:txt_content' : 'extraction:txt';
gulp.task('default', () => runSequence('extraction:local','server:dist', 'watch:dist', extractionTxt)); // aem 기준
gulp.task('local', () => runSequence('server:src', 'watch:src')); // 로컬 실행
gulp.task('aem', () => runSequence('server:dist', 'watch:dist')); // aem 실행
gulp.task('txt', () => runSequence('extraction:aem', extractionTxt)); // txt 추출