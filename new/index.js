
let handle = {
  set: (obj, key, value, receiver) => {
    console.log('执行set', key, value)
    let result = Reflect.set(obj, key, value, receiver);
    trigger(obj, key)  // 先设置值，再触发更新
    return result
  },
  get: (obj, key) => {
    track(obj, key)
    console.log('执行get', key)
    return Reflect.get(obj, key)
  }
}

let targetMap = new WeakMap();
let proxyMap = new WeakMap();
let activeEffect;
let effectArr = [];

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      console.log('收集依赖', key);
      (activeEffect.deps || (activeEffect.deps = [])).push(dep)
    }
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return
  let dep = depsMap.get(key);
  if (dep) {
    console.log('触发更新', key, '依赖数量:', dep.size);
    // 创建副本避免无限循环
    const effectsToRun = new Set(dep);
    effectsToRun.forEach(effect => {
      if(effect.scheduler){
        effect.scheduler();
      }else{
        effect(); 
      }
      
    });
  }
}

function reactive(obj) {
  if (proxyMap.has(obj)) {
    return proxyMap.get(obj)
  } else {
    let newObj = proxy(obj, handle)
    proxyMap.set(obj, newObj)
    return newObj
  }
}

function proxy(obj, handle) {
  return new Proxy(obj, handle);
}

function ref(obj) {
  let newObj = {
    value: obj
  }
  if (typeof obj === 'object') {
    return reactive(obj)
  } else {
    return reactive(newObj)
  }
}

function effect(fn, options={}) {
  const reactiveEffect = function() {
    // 清理之前的依赖
    clearEffect(reactiveEffect);
    
    try {
      // 设置当前活跃的 effect
      activeEffect = reactiveEffect;
      effectArr.push(reactiveEffect);
      // 执行函数并收集依赖
      return fn();
    } finally {
      effectArr.pop();
      activeEffect = effectArr[effectArr.length - 1];
    }
  }
  
  // 初始化 deps 数组
  reactiveEffect.deps = [];
  reactiveEffect.fn = fn;
  reactiveEffect.lazy = options.lazy;
  reactiveEffect.scheduler = options.scheduler;
 if(!options.lazy){
    // 立即执行一次
   reactiveEffect();
 }
  
  return reactiveEffect;
}

function clearEffect(effect) {
  const { deps } = effect;
  if (deps && deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
class ComputeedRefImpl{
  constructor(getter,setter){
    this._getter = getter;
    this._setter = setter;
    this._value = undefined;
    this._effect = null;
    this._dirty = true;
    this._effect = effect(getter,{
      lazy: true,
      scheduler: ()=>{
        if(!this._dirty){
          this._dirty = true;
          trigger(this,'value')
        }
      }
    })
  }
  get value (){
    if(activeEffect){
      let depsMap = targetMap.get(this);
      if(!depsMap){
        depsMap = new Map();
        targetMap.set(this,depsMap);
      }
      let dep = depsMap.get('value');
      if(!dep){
        depsMap.set('value',( dep = new Set()))
      }
      if(!dep.has(activeEffect)){
        dep.add(activeEffect);
        (activeEffect.deps || (activeEffect.deps=[])).push(dep)
      }
    }
    if(this._dirty){
      this._value = this._effect();
      this._dirty = false
    }
    return this._value
  }
  set value (newvalue){
    if(this._setter){
      this._setter(newvalue)
    }
  }
}
function computed(fn){
  let getter , setter;
  if(typeof fn === 'function'){
    getter = fn;
    setter = undefined;
  }else{
    getter = fn.get;
    setter = fn.set;
  }
  return new ComputeedRefImpl(getter,setter);
  
}
function reactiveComputed(fn){

}
// 测试代码
const text = ref('111');


// setTimeout(() => {
//   console.log('开始更新');
//   text.value = '222';  // 这会触发更新
// }, 2000);
// 测试只读 computed
const state = reactive({ 
  count: 0, 
  double: 0 
});

const doubleCount = computed(() => {
  console.log('计算 doubleCount');
  return state.count * 2;
});


// effect(() => {
//   console.log('执行渲染');
//   document.body.innerHTML = doubleCount.value;
// });
// setTimeout(() => {
//   console.log('开始更新');
//   state.count = 2;  // 这会触发更新
// }, 2000);
class myPromise{
  constructor(fn){
    this.state = 'pending';// fulfilled rejected
    this.resolveCollect = [];
    this.rejectCollect = [];
    this.resloveVaule = '';
    this.rejectValue = '';
    fn(this.resolve.bind(this),this.reject.bind(this))
  }
  set state(newValue){
    this.state = newValue;
    if(newValue === 'fulfilled'){
      this.resolveCollect.forEach(fn => {
        fn(this.resloveVaule)
      })
    }
    if(newValue === 'rejected'){
      this.rejectCollect.forEach( item => {
        fn(this.rejectValue)
      } )
    }
  }
  resolve(resloveVaule){
    if(this.state === 'pending'){
      this.state = 'fulfilled';
      this.resloveVaule = resloveVaule;
    }
  }
  reject(rejectValue){
    if(this.state === 'rejected'){
      this.state = 'rejected';
      this.rejectValue = rejectValue;
    }
  }
  then(resolveFn,rejectFn){
    const  resolveFnresult = (resolve,reject,newpromise) => {
      queueMicrotask(()=>{
        try{
          if(typeof resolveFn === 'function'){
            let x = resolveFn();
            this.resolvePromise(newpromise,x,resolve,reject)
          }else{
            resolve(this.resloveVaule)
          }
        }catch(e){
          reject(e)
        }
        
      })
    }
    const  rejectFnresult = (resolve,reject,newpromise) => {
      queueMicrotask(()=>{
        try{
          if(typeof rejectFn === 'function'){
            let x = rejectFn();
            this.resolvePromise(newpromise,x,resolve,reject)
          }else{
            reject(this.rejectValue)
          }
        }catch(e){
          reject(e)
        }
      })
    }
    let newpromise;
    switch(this.state){
      case 'pending' :{
        newpromise =  new myPromise((resolve,reject)=>{
          this.rejectCollect.push(()=>{
            resolveFnresult(resolve,reject,newpromise)
          })
          this.resolveCollect.push(()=>{
            rejectFnresult(resolve,reject,newpromise)
          })
        })
      }
      case 'fulfilled': {
        newpromise = new myPromise((resolve,reject)=>{
          resolveFnresult(resolve,reject,newpromise)
        })
      }
      case "rejected": {
        newpromise = new myPromise((resolve,reject)=>{
          rejectFnresult(resolve,reject,newpromise)
        })
      }
      return newpromise
    }
  }
  resolvePromise(newpromise,x,resolve,reject){
    if(x === newpromise)return reject(new Error('重复'));
    if(!x)return resolve(x);
    if(x instanceof myPromise){
      queueMicrotask(()=>{
        x.then(y=>{
        this.resolvePromise(newpromise,y,resolve,reject)
      })
      })
    }else if(typeof x === 'function' || typeof x === 'object') {
      try{
        let then = x.then;
        if(then){
          let called = false;
          then.call(x,(y)=>{
            if(called)return
            called = true;
            this.resolvePromise(newpromise,y,resolve,reject)
          },(e)=>{
            called = true;
            if(called)return
            reject(new Error(e))
          })
        }else{
          resolve(x)
        }
      }catch(e){
        reject(new Error(e))
      }
    }else{
      resolve(x)
    }
  }
}
let arr = [0,10,0,1,1,2,9,3,7,5,10,20,7]
function bubble(arr){
  for(let i=0;i<arr.length-1;i++){
    console.log(arr[i])
    for(let j=0;j<arr.length-i-1;j++){
      if(arr[j]>arr[j+1]){
        [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
      }
    }
  }
  return arr;
}
function quick(arr){
  if(arr.length<2)return arr
  let start = arr.splice(Math.floor(arr.length / 2), 1);
  let resL = [],resR=[];
  for(let i = 0; i<arr.length;i++){
      if(arr[i]<start){
        resL.push(arr[i])
      }else{
        resR.push(arr[i])
      }
      
  }
  return [...quick(resL),...start,...quick(resR)]
}
function partition(arr,left=0,right=arr.length){
  let inx = arr[left];
  let cur = left+1;
  for(let i=1; i<arr.length; i++ ){
    if(arr[i]<inx){
      [arr[i],arr[cur]] = [arr[cur],arr[i]]
      cur++;
    }
  }
  [arr[left],arr[cur-1]] = [arr[cur-1],arr[left]];  
  return cur -1;
}
function select(arr){
  for(let i=0;i<select.length;i++){
    
  }
}
function deepArr(arr){
  let narr = [...arr];
  let len = narr.length;
  let res = [];
  for(let i=0;i<len;i++){
    res.push(narr[i].title);
    if(narr[i].children){
      let carr = deepArr(narr[i].children);
      res = res.concat(carr)

    }
  }
  return res;
}
function deepArr2(arr){
  let res = [];
  let carr = [...arr];
  while(carr.length){
    let item = carr.shift();
    let children = item.children || [];
    res.push(item.title);
    for(let i=children.length-1;i>=0;i--){
      carr.unshift(children[i])
    }
  }
  return res
}
function breadth(arr){
  let res = [];
  let carr = [...arr];
  while(carr.length){
    let item = carr.shift();
    let children = item.children || [];
    res.push(item.title);
    for(let i=0;i<children.length;i++){
      carr.push(children[i])
    }
  }
  return res
}
let tArr = [
  {
    title:'1',
    children: [
      {
        title:'1.1',
      },
      {
        title:'1.2',
        children:[
          {
            title:'1.2.1'
          }
        ]
      }
    ]
  },
  {
    title:'2'
  }
]
//console.log(breadth(tArr))

function limitSend(limit, urls, fetchFn) {
    let pending = new Set(); // 正在进行的请求
    let results = []; // 存储结果
    
    async function run() {
        while (urls.length > 0) {
            // 如果达到并发限制，等待其中一个完成
            if (pending.size >= limit) {
                await Promise.race(pending);
            }
            
            // 还有URL待处理且未达到限制
            if (urls.length > 0 && pending.size < limit) {
                const url = urls.shift();
                const promise = fetchFn(url).then(result => {
                    results.push(result);
                    pending.delete(promise);
                    return result;
                }).catch(error => {
                    results.push({ error, url });
                    pending.delete(promise);
                    throw error;
                });
                
                pending.add(promise);
            }
        }
        
        // 等待所有剩余请求完成
        await Promise.allSettled(pending);
        return results;
    }
    
    return run();
}
// 模拟请求函数
const mockFetch = (url) => new Promise((resolve,reject) => 
    setTimeout(() =>{
      if(url.indexOf('7')>-1){
        reject(`Response from ${url}`)
      }else{
        resolve(`Response from ${url}`)
      }
       
    }, Math.random() * 2000)
);


// function* limitQueue(limit,urls,fetchFn){
//     let queue = new Set();
//     let result = [];
//     async function delPromise(){
//         let [ promise,value ] = await Promise.race(queue);
//         queue.delete(promise);
//         result.push(value);
//     }
//     async function run(){
//         while(urls.length){
//             let url = urls.shift();
//             let promise = fetchFn(url).then(res=>[promise,res]).catch(e=>[promise,{
//                     url,
//                     error: e
//                 }])
//             queue.add(promise)
//             if(queue.size>=limit){
//                 yield await delPromise();
//             }
//         }
//         while(queue.size){
//             yield await delPromise()
//         }
//     }
//     return run()
// }
// 使用
// limitSend(3, ['url1', 'url2', 'url3', 'url4','url5','url6','url7'], mockFetch)
//     .then(results => console.log('All done:', results))
//     .catch(err => console.error('Error:', err));
// setTimeout(() => {
//     console.log(1);
// });
// process.nextTick(()=>{
//     console.log(2);
//     Promise.resolve().then(()=>{
//        console.log(6);
//     })
//     // process.nextTick(()=>{
//     //     console.log(6);
//     // });
// });
// console.log(3);
// Promise.resolve().then(()=>{
//     console.log(4);
//     process.nextTick(()=>{
//         console.log(5)
//     });
// });
