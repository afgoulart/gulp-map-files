var path        = require('path');
var through     = require('through2');
var PluginError = require('plugin-error');
var util        = require('util');

module.exports = function (file, opt) {
  if (!file) {
    throw new PluginError('gulp-files-to-object', 'Missing file option for gulp-files-to-object');
  }

  opt = opt || {};

  var latestFile;
  var latestMod;
  var fileName;
  var mustacheParts = {};

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new PluginError('gulp-files-to-object', 'Missing path in file options for gulp-files-to-object');
  }

  function bufferContents(file, enc, callback){
    if (file.isNull()) {
      callback();
      return;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError({
        plugin: 'gulp-files-to-object',
        message: 'Streams are not supported.'
      }));
      return callback();
    }

    mustacheParts[path.basename(file.path, '.mustache')] = file.contents.toString();

    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    callback();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (!latestFile || !Object.keys(mustacheParts).length ) {
      cb();
      return;
    }

    var joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof file === 'string') {
      joinedFile = latestFile.clone({contents: false});
      joinedFile.path = path.join(latestFile.base, file);
    } else {
      joinedFile = new File(file);
    }

    joinedFile.contents = new Buffer(JSON.stringify(mustacheParts));

    this.push(joinedFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
}