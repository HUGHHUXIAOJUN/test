//封装MyPromise
class MyPromise{
    constructor(excutor){
        // this--> 当前promise的实例；
        this.state = "pending"; //创建实例，默认状态是pending；
        this.fulfilledEvent=[]; //当前实例成功的事件池；
        this.rejectedEvent=[]; //当前实例失败的事件池；
        let resolve = (result)=>{ //只有调用resolve时，该实例的状态要改变为成功态；
            console.log(new Date().getTime(),'执行resolve',this.state,result)
            if(this.state!=="pending")return; //如果不是pending;不需要往下执行
            this.state="fulfilled";
            // 循环成功态的事件池；依次执行；
            clearTimeout(this.timer); //执行之前，首先清除之前的定时器；为了防止定时器的累加；
            this.timer = setTimeout(()=>{
                this.fulfilledEvent.forEach((item)=>{
                    if(typeof item==="function"){
                        item(result);
                    }
                })
                console.log(new Date().getTime(),'由于堆栈机制我后执行resolve')
            },0)
            console.log(new Date().getTime(),'执行resolve',this.state)
        }
        let reject = (result)=>{ //只有调用resolve时，该实例的状态要改变为失败态；
            if(this.state!=="pending")return;
            this.state = "rejected";
            //执行之前，首先清除之前的定时器；为了防止定时器的累加；
            clearTimeout(this.timer);
            this.timer = setTimeout(()=>{ //要用箭头函数，不用箭头函数，里面的this就丢了；
                this.fulfilledEvent.forEach((item)=>{
                    if(typeof item==="function"){
                        item(result);
                    }
                })
            },0)
        }
        try{
            // 一旦执行报错，那么会执行reject；
            //当new promise(function (resolve,reject) {}的时候，function会自动执行，所以这里要让excutor()执行；
            excutor(resolve,reject);
        }catch (e){
            reject(e);
        }
    }
    then(resolveFn,rejectFn){ //p可以调用then方法，说明then方法在promise的原型上；所以把then放到了MyPromise的原型上
        //实现then的链式写法，需要then返回一个promise的实例；
        console.log('我是then方法先执行')
        return new MyPromise((resolve,reject)=>{
            this.fulfilledEvent.push((result)=>{
                //console.log(resolveFn);
                let x = resolveFn(result);
                // x.then : 向x的事件池中放入resolve和reject方法；
                // console.log(resolve);
                console.log('判断传参，确认返回,如果x是mypromise还是需要继续执行下去，如果不是结束,resolve清除定时器，并把状态改变')
                x instanceof MyPromise?x.then(resolve,reject):resolve();
            });
        })
    }
}
let p=new MyPromise(function (resolve,reject) {
    console.log('我是新promise')
        setTimeout(()=>{
            console.log('ajax请求')
            //第一没有push 所以resolve中队列未执行
            resolve('resolve1111111')
        },2000)
}).then(res=>{
    console.log('执行then')
    console.log(res)
})

// let p = new MyPromise(function (resolve,reject) {
//     resolve(100);
// });
// let p1;
// //then : ；then应该向事件池中订阅方法；
// p.then(function (a) { //已经捆绑到了p这个实例的事件池中；
//     p1 = new MyPromise(function (resolve,reject) {
//         //resolve执行会让该实例的成功的事件池执行；
//         resolve();// this--> p1
//     });
//     return p1;
// }).then(function () {
//     console.log(p1.fulfilledEvent);
//     console.log(1);
//     //函数捆绑到上一个then返回的新的实例上；
// })
/* p.then(function () {
    console.log(2);
})*/
// 第一次执行then：函数fn1被包装放到p的成功事件池中，then返回一个新的实例；
// 第二次执行then：函数fn2被包装放到上一个then返回的新实例的事件池中；
// 第一个resolve执行，执行p事件池中的fn1:fn1执行时返回一个promise实例p1，p1调用then，绑定一个第一次执行then的resolve到p1的事件池中
// 第二个resolve执行，执行p1事件池中的方法：resolve执行，resolve中的this指向上一级作用域的this，上一级作用域的this是第一个then执行时返回的新实例，所以让第一次执行then的实例的事件池中方法执行；

