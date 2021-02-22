'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _b = require('./b.js');

function foo() {
  console.log('foo');
  (0, _b.bar)();
  console.log('执行完毕');
}
foo();