import {bar} from './b.js';
(()=>{
  console.log(1)
})()
export function foo() {
  console.log('foo');
  bar();
  console.log('执行完毕');
}
foo();