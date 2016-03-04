var gulpMapFiles = require('../');
var should = require('should');
var fs = require('fs');
var path = require('path');
var assert = require('stream-assert');
var test = require('./test-stream');
var File = require('gulp-util').File;
var gulp = require('gulp');
require('mocha');

var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); }

var thirdBase = __dirname,
    thirdFile = 'third.js',
    thirdPath = path.join(thirdBase, thirdFile);

describe('gulp-map-files', function() {
  // Create a third fixture, so we'll know it has the latest modified stamp.
  // It must not live in the test/fixtures directory, otherwise the test
  // 'should take path from latest file' will be meaningless.
  before(function(done){
    fs.writeFile(thirdPath, 'console.log(\'third\');\n', done);
  });

  // We'll delete it when we're done.
  after(function(done){
    fs.unlink(thirdPath, done);
  });

  describe('gulpMapFiles()', function() {
    it('should throw, when arguments is missing', function () {
      (function() {
        gulpMapFiles();
      }).should.throw('Missing file option for gulp-map-files');
    });

    it('should ignore null files', function (done) {
      var stream = gulpMapFiles('test.js');
      stream
        .pipe(assert.length(0))
        .pipe(assert.end(done));
      stream.write(new File());
      stream.end();
    });

    // TODO: file.isStream()??
    it('should emit error on streamed file', function (done) {
      gulp.src(fixtures('*'), {buffer: false})
        .pipe(gulpMapFiles('test.js'))
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });

    it('should mapping one file', function (done) {
      test('wadap')
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.eql('{"file0":"wadap"}'); }))
        .pipe(assert.end(done));
    });

    it('should mapping multiple files', function (done) {
      test('wadap', 'doe')
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.eql('{"file0":"wadap","file1":"doe"}'); }))
        .pipe(assert.end(done));
    });

    it('should mapping buffers', function (done) {
      test([65, 66], [67, 68], [69, 70])
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.eql('{"file0":"AB","file1":"CD","file2":"EF"}'); }))
        .pipe(assert.end(done));
    });

    it('should preserve mode from files', function (done) {
      test('wadaup')
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.stat.mode.should.eql(0666); }))
        .pipe(assert.end(done));
    });

    it('should take path from latest file', function (done) {
      gulp.src([fixtures('*'), thirdPath])
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (newFile) {
          var newFilePath = path.resolve(newFile.path);
          var expectedFilePath = path.resolve(path.join(thirdBase, 'test.js'));
          newFilePath.should.equal(expectedFilePath);
        }))
        .pipe(assert.end(done));
    });

    it('should preserve relative path from files', function (done) {
      test('wadap', 'doe')
        .pipe(gulpMapFiles('test.js'))
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.relative.should.eql('test.js'); }))
        .pipe(assert.end(done));
    });

    describe('should not fail if no files were input', function () {
      it('when argument is a string', function(done) {
        var stream = gulpMapFiles('test.js');
        stream.end();
        done();
      });

      it('when argument is an object', function(done) {
        var stream = gulpMapFiles({path: 'new.txt'});
        stream.end();
        done();
      });
    });
  });
});
