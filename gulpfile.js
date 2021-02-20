
let project_folder = "dist",
    source_folder = "src",

    path = {
        build: {
            html: project_folder + "/",
            css: project_folder + "/css/",
            js: project_folder + "/js/",
            img: project_folder + "/img/"
        },
        src: {
            html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
            css: [source_folder + "/sass/style.sass", source_folder + "/css/*.css"],
            js: source_folder + "/js/*.js",
            img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
        },
        watch: {
            html: source_folder + "/**/*.html",
            css: source_folder + "/sass/**/*.sass",
            js: source_folder + "/js/**/*.js",
            img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
        },
        clean: "./" + project_folder + "/"
    },

    {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webpcss');


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"]
            })
        )
        .pipe(webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp'
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 2, // 0 to 7
                svgoPlugins: [{removeViewBox: true}]
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(images, js, css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;