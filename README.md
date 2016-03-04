# gulp-map-files

> Gulp task to map files and export a content of the buffer in json.

This implementation is relatively closes to the original [gulp-concat](https://github.com/wearefractal/gulp-concat) plugin.

However this plugin provides `.header()` & `.footer()` helpers used in complex build worflow of gulp-concat-util.

## Getting Started

This plugin requires Gulp `^3.0.0`

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to create a [Gulpfile](https://github.com/gulpjs/gulp/blob/master/docs/API.md) as well as install and use Gulp plugins. Once you're familiar with that , you may install this plugin with this command:

```shell
npm install gulp-map-files --save-dev
```

Once the plugin has been installed, it may be required inside your Gulpfile with this line of JavaScript:

```javascript
var gulpMapFiles = require('gulp-map-files');
```

## Usage

```javascript
var gulpMapFiles = require('gulp-map-files');

gulp.task('concat:dist', function() {
  gulp.src('scripts/{,*/}*.js')
    .pipe(gulpMapFiles('combined.json'))
    .pipe(gulp.dest('dist'));
});
```

Advanced usage example combine other module, transforming from JSON to JS file. Just adding a declaration at the top ( 'var templates = ' ) and footer ( ';' )  of the file using .header and .footer;

```javascript
var gulpMapFiles = require('gulp-map-files');

gulp.task('concat:dist', function() {
  gulp.src('scripts/{,*/}*.js')
    .pipe(gulpMapFiles(pkg.name + '.js'))
    .pipe(gulpMapFiles.header('var templates = '))
    .pipe(gulpMapFiles.footer(';'))
    .pipe(gulp.dest('dist'));
});
```

## Options

#### verbose (Boolean) // TODO

- `Boolean` - Whether initial files should pass through
- Default: `false`

## Testing

###

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.


## Authors

**André Filipe Goulart**

+ http://github.com/afgoulart


## Copyright and license

    The MIT License

    Copyright (c) 2016 André Filipe Goulart

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.