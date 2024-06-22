const PENDING = 'pending';
const FULFULLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise{
    _status=PENDING; // 初始状态
    FULFULLED_LIST = []; // then中resolve返回函数存放
    REJECTED_list = []; // then中reject返回函数存放
    constructor(fn){
        this.status = PENDING;
        this.value = '';
        this.reason = '';
        fn(this.resolve.bind(this),this.reject.bind(this))
    }
    get status(){
        return this._status
    }
    set status(newVal){
        this._status = newVal;
        if(newVal===FULFULLED){
            this.FULFULLED_LIST.forEach(fn=>{
                fn(this.value)
            })
        }else if(newVal===REJECTED){
            this.REJECTED_list.forEach(fn=>{
                fn(this.reason)
            })
        }
    }
    resolve(value){
        // 保证状态未改变
        if(this.status === PENDING){
            this.value = value;
            this.status = FULFULLED
            /** 这样写比较方便 calss中也可以用setter和getter */
            // this.FULFULLED_LIST.forEach(fn=>{fn(this.value)})
        }
    }
    reject(reason){
        if(this.status === PENDING){
            this.reason = reason;
            this.status = REJECTED
            // this.FULFULLED_LIST.forEach(fn=>{fn(this.reason)})
        }
    }
    then(onFulfilled,onRejected){
        const resolveOnFulfilled = (resolve,reject,newPromise)=>{
            queueMicrotask(()=>{
                try{
                    if(this.isFunction(onFulfilled)){
                        let x = onFulfilled(this.value)
                        this.resolvepromise(newPromise,x,resolve,reject)
                    }else{
                        resolve(this.value)
                    }
                }catch(e){
                    reject(e)
                }
            })
        }
        const rejectOnRejected = (resolve,reject,newPromise)=>{
            queueMicrotask(()=>{
                try{
                    if(this.isFunction(onRejected)){
                        let x = onRejected(this.reason)
                        this.resolvepromise(newPromise,x,resolve,reject)
                    }else{
                        reject(this.reason)
                    }
                }catch(e){
                    reject(e)
                }
            })
        }
        switch(this.status){
            case PENDING: {
                let newPromise = new MyPromise((resolve,reject)=>{
                    this.FULFULLED_LIST.push(()=>resolveOnFulfilled(resolve,reject,newPromise))
                    this.REJECTED_list.push(()=>rejectOnRejected(resolve,reject,newPromise))
                })
                return newPromise
            }
            case FULFULLED: {
                let newPromise = new MyPromise((resolve,reject)=>resolveOnFulfilled(resolve,reject,newPromise))
                return newPromise
            }
            case REJECTED: {
                let newPromise = new MyPromise((resolve,reject)=>rejectOnRejected(resolve,reject,newPromise))
                return newPromise
            }
        }
    }
    resolvepromise(newpromise,x,resolve,reject){
        if(newpromise === x)return reject(new TypeError('重复调用'))
        if(x instanceof MyPromise){
            x.then((y)=>{
                // 直到状态为改变
                this.resolvepromise(newpromise,y,resolve,reject)
            })
        }else if(this.isFunction(x)|| typeof x === 'object'){
            if(x === null)return resolve(x)
            let then = null
            try{
                then = x.then
            }catch(e){
                return reject(e)
            }
            if(this.isFunction(then)){
                try{
                    let called = false;
                    then.call(x,(y)=>{
                        if(called)return
                        called = true
                        this.resolvepromise(newpromise,y,resolve,reject)
                    },(r)=>{
                        if(called)return
                        called = true
                        return reject(r)
                    })
                }catch(e){
                    return reject(new Error(e))
                }   
            }else{
                return resolve(x)
            }
        }else{
            resolve(x)
        }
    }
    catch(onRejected){
      return  this.then(null,onRejected)
    }
    isFunction(fn){
        return typeof fn === 'function'
    }
    static resolve(value){
        if(value instanceof MyPromise)return value
        return new MyPromise((resolve)=>{
            resolve(value)
        })
    }
    static reject(reason){
        if(reason instanceof MyPromise)return reason
        return new MyPromise((resolv,reject)=>{
            reject(reason)
        })
    }
    static all(promiseArr){
        if(!Array.isArray(promiseArr)){
            throw new Error('params must array')
        }
        let ret = [],num=0
        return new MyPromise((resolve,reject)=>{
            if(promiseArr.length===0)return resolve(ret)
            for(let i=0;i<promiseArr.length;i++){
                MyPromise.resolve(promiseArr[i]).then(res=>{
                    ret[i] = res;
                    num++
                    if(num===promiseArr.length){
                        resolve(ret)
                    }
                }).catch((e)=>{
                    reject(e)
                })
            }
        })
    }
    static race(promiseArr){
        if(!Array.isArray(promiseArr)){
            throw new Error('params must array')
        }
        return new MyPromise((resolve,reject)=>{
            if(promiseArr.length===0)return resolve()
            for(let i=0;i<promiseArr.length;i++){
                MyPromise.resolve(promiseArr[i]).then(res=>{
                    resolve(res)
                },(e)=>{
                    reject(e)
                })
            }
        })
    }
}
// const test = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//        // resolve(111);
//         reject(222)
//     }, 500);
// })

// const test1 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('执行异步')
//        // resolve(111);
//         reject(222)
//     }, 500);
// }).then((res)=>{
//     console.log(res)
// },(e)=>{
//     console.log('rejct')
//     return 11
// }).then(()=>{
//     console.log(222)
// }).catch(e=>{
//     console.log('执行了')
// })
// // 这边test 是then返回的新promise 所以value值是undefined 去掉then值是111
// console.log(test1);

// setTimeout(() => {
//     console.log(test1);
// }, 2000)
// console.log(MyPromise.resolve(222))
// console.log(MyPromise.reject(333).then(()=>{},(e)=>{
//     console.log(e)
// }))
// const test2 = new MyPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('22222')
//     },300)
// })
// const test3 = new MyPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('33333')
//     },500)
// })
// MyPromise.race([test2,test3]).then(res=>{
//     console.log(res)
// })
// MyPromise.all([test2,test3]).then(res=>{
//     console.log(res)
// })
//  number 64位  8字节
// string 2字节
// boolean 4字节
const seen = new WeakSet();
function sizeIfObject(object){
    if(object===null)return 0
    let bytes = 0;
    // 对象key 也占内存空间
    const properties = Object.keys(object)
    for(let i=0;i<properties.length;i++){
        const key = properties[i];
        bytes+=calculator(key)
        if(typeof object[key]==='object'&& object[key]!==null){
            if(seen.has(object[key])){
                continue
            }
            seen.add(object[key])
        }
        bytes+=calculator(object[key])
    }
    return bytes 
}
function calculator(object){
    const objectType = typeof object
    switch(objectType){
        case 'string': {
            return object.length * 2
        }
        case 'boolean': {
            return 4
        }
        case 'number': {
            return 8
        }
        case 'object': {
            if(Array.isArray(object)){
                return object.map(calculator).reduce((res,current)=>res+current,0)
            }else{
                return sizeIfObject(object)
            }   
        }
        default: {
            return 0
        }
    }
}

class XhrHook {
    constructor(beforeHooks = {}, afterHooks = {}){
        this.XHR = window.XMLHttpRequest;
        this.beforeHooks = beforeHooks;
        this.afterHooks = afterHooks;
        this.init();
    }
    init(){
        let _this = this;
        window.XMLHttpRequest =  function(){
            this._xhr = new _this.XHR()
            _this.overwrite(this)
        }
    }
    overwrite(proxyXHR){
        for(let key in proxyXHR._xhr){
            if(typeof proxyXHR._xhr[key]==='function'){
                this.overwriteMethod(key,proxyXHR)
                continue
            }
            this.overwriteAttributes(key,proxyXHR)
        }
    }
    overwriteMethod(key,proxyXHR){
        let beforeHooks = this.beforeHooks;
        let afterHooks = this.afterHooks
        proxyXHR[key] = (...agrs)=>{
            if(beforeHooks[key]){
                const res = beforeHooks[key].call(proxyXHR,...args)
                if(res===false){
                    return
                }
            }
            const res = proxyXHR._xhr[key].apply(proxyXHR._xhr,agrs)
            afterHooks[key]&& afterHooks[key].call(proxyXHR._xhr,res)
            return res
        }
    }
    overwriteAttributes(key,proxyXHR){
        Object.defineProperties(proxyXHR,key,this.setProperDescriptor(key,proxyXHR))
    }
    setProperDescriptor(key,proxyXHR){
        let obj = Object.create(null);
        let _this = this;
        obj.set = function(val){
            if(!key.startsWith('on')){
                proxyXHR['_'+key] = val
                return
            }
            if(_this.beforeHooks[key]){
                this._xhr[key] = function(...args){
                    _this.beforeHooks[key].call(proxyXHR)
                    val.apply(proxyXHR,args)
                }
                return
            }
            this._xhr[key] = val
        }
        obj.get = function (){
            return proxyXHR['_'+key] || this._xhr[key]
        }
        return obj
    }
}
