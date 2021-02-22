'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

var _a = require('./a.js');

function bar() {
  console.log('bar');
  (0, _a.foo)();
} // b.js