// b.js
import {foo} from './a.js';
export function bar() {
  console.log('bar');
  foo();
}