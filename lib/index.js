'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var baseRequire = module.constructor.prototype.require;
var NODE_ENV = process.env.NODE_ENV;

var satisfies = function satisfies(v, s) {
  return _semver2['default'].satisfies(v, '^' + s) ? v : null;
};

var resolveVersion = function resolveVersion(name) {
  var main = _resolve2['default'].sync(name, { basedir: process.cwd() });
  var NM = '/node_modules/';
  var lastIndex = main.lastIndexOf(NM);
  var start = main.slice(0, lastIndex);

  var _main$slice$slice$split = main.slice(lastIndex).slice(NM.length).split(_path2['default'].sep);

  var _main$slice$slice$split2 = _slicedToArray(_main$slice$slice$split, 1);

  var moduleName = _main$slice$slice$split2[0];

  var packagePath = _path2['default'].join(start, 'node_modules', moduleName, 'package.json');
  return JSON.parse(_fs2['default'].readFileSync(packagePath)).version;
};

var newRequire = function newRequire(request) {
  var newRequest = request;

  var _request$split = request.split('@');

  var _request$split2 = _slicedToArray(_request$split, 2);

  var name = _request$split2[0];
  var version = _request$split2[1];

  if (name && version) {
    var match = satisfies(resolveVersion(name), version);

    if (match) {
      if (match !== version && NODE_ENV !== 'production') {
        console.warn(name + ' was required as ' + version + ' but will be using ' + match + '.');
      }
      newRequest = name;
    } else {
      throw new Error('Tried to require ' + name + ' but could not find a version that satisfied semver for ' + version + '.');
    }
  }

  return baseRequire.apply(this, [newRequest]);
};

module.constructor.prototype.require = newRequire;