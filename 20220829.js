function flatdep(arr,dep=1){
    const res = [];
   (function flat(arr,dep){
    for(let item of arr){
        if(Array.isArray(item)&&dep>0){
            flat(item,dep-1)
        }else{
            res.push(item)
        }
       }
   })(arr,dep)
   
   return res
}
// const forFlat = (arr = [], depth = 1) => {
//     const result = [];
//     (function flat(arr, depth) {
//       for (let item of arr) {
//         if (Array.isArray(item) && depth > 0) {
//           flat(item, depth - 1)
//         } else {
//           // 去除空元素，添加非 undefined 元素
//           item !== void 0 && result.push(item);
//         }
//       }
//     })(arr, depth)
//     return result;
//   }
console.log(flatdep([1,2,3,4,[5,5,6,[2,3]],[6,7]]))

// class Pub{
//     constructor(){
//         this.collect = {}
//     }
//     on(type,handle){
//         (this.collect[type]||(this.collect[type]=[])).push(handle)
//     }
//     del(type,handle){
//         let arr = this.collect[type];
//         if(!arr||arr.length<1)return this
//         let i = arr.indexOf(handle);
//         if(i>-1){
//             arr.split(i,1)
//         }else{
//             arr = []
//         }
//     }
//     emit(type,...arg){
//         if(!type) return this
//         let arr = this.collect[type]
//         for(let fn of arr){
//             fn.apply(this,arg)
//         } 
//     }
// }

// class Dep {
//     constructor(){
//         this.collect = []
//     }
//     notify(){
//         let arr =  this.collect;
//         for(let item in arr){
//             item.update()
//         }
//     }
// }
// class Watcher{
//     constructor(params) {
        
//     }
//     update(){
//         // do something
//     }
// }

function a(){
    let count = 0;
    function add(){
        count++
    }
    let msg = count
    function log(){
        console.log(msg)
    }
    return {add,log}
}
let b = a();
b.add()
b.add()
b.add()
b.log()