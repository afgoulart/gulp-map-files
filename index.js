var path        = require('path');
var through     = require('through2');
var PluginError = require('gulp-util').PluginError;
var util        = require('util');

module.exports = function (file, opt) {
  if (!file) {
    throw new PluginError('gulp-map-files', 'Missing file option for gulp-map-files');
  }

  opt = opt || {};

  var latestFile;
  var latestMod;
  var fileName;
  var mapParts = {};

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new PluginError('gulp-map-files', 'Missing path in file options for gulp-map-files');
  }

  function bufferContents(file, enc, callback){
    if (file.isNull()) {
      callback();
      return;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-map-files', 'Streams are not supported.'));
      callback();
      return;
    }

    mapParts[path.basename(file.path, path.extname(file.path))] = file.contents.toString();

    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    callback();
  }

  function endStream(callback) {
    // no files passed in, no file goes out
    if (!latestFile || !Object.keys(mapParts).length ) {
      callback();
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

    joinedFile.contents = new Buffer(JSON.stringify(mapParts));

    this.push(joinedFile);
    callback();
  }

  return through.obj(bufferContents, endStream);
}