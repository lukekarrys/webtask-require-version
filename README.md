webtask-require-version
===================

Override `require` so you can test your [webtask.io](https://webtask.io) scripts.

[![NPM](https://nodei.co/npm/webtask-require-version.png)](https://nodei.co/npm/webtask-require-version/)
[![Build Status](https://travis-ci.org/lukekarrys/webtask-require-version.png?branch=master)](https://travis-ci.org/lukekarrys/webtask-require-version)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/lukekarrys/webtask-require-version.svg)](https://greenkeeper.io/)


## Install

`npm install webtask-require-version`


## Usage

[webtask.io](https://webtask.io/docs/modules) only allows specific versions of modules to be used. When writing my webtasks I wanted to test against those same specific versions (mocking depedencies manually). This module does that by overriding `require` to make the `require('module@x.y.z')` syntax valid.

**your-webtask.js**
```js
var request = require('request@2.56.0')
var qs = require('qs@3.1.0')
var _ = require('lodash@3.9.3')

module.exports = function (ctx, cb) {
  // Use request, qs, and lodash in your webtask
}
```

**test.js**
```js
// This overrides the default `require`
require('webtask-require-version')

// Your webtask can now use use requires like require('request@2.56.0')
var webtask = require('./your-webtask')

// Other requires will still work
require('tape')(function (t) {
  // Test your webtask
  webtask(context, function (err, data) {
    t.equal(data, expected)
    t.end();
  })
})
```

#### What happens if that version is not installed locally?

`webtask-require-version` will throw an error if you try to require a module that does not match based on the [`semver ^`](https://github.com/npm/node-semver#caret-ranges-123-025-004) operator. It will also log a warning if `semver` does match but the versions dont match exactly. This warning can be suppressed by using `NODE_ENV=production`.


## Contributing

This is written in ES6 and compiled to ES5 using [`babel`](https://babeljs.io/). The code you require will come from the `lib/` directory which gets compiled from `src/` before each `npm publish`.


## Tests

`npm test`


## License

MIT
