// let person={
//     name:'hugh',
//     age:15
// }
let val='tom';
let person={};
Object.defineProperty(person,'name',{
    get(){
        console.log('name属性被读取了...');
        return val;
    },
    set(newVal){
        console.log('name属性被修改了...');
        val = newVal;
    }
})
person.name=val;
console.log(person.name)

let user= {
    name:'John',
    surname:'Doe'
}
let proxy=new Proxy(user,{
    get(target,property){
        let value=target[property];
        if(!value){
            throw new Error(`The property is [${property}] does not exist`)
        }
        return value
    }
})
let printUser=(property)=>{
    console.log(`The user ${property} is ${proxy[property]}`)
}
printUser('name') //the name is john
printUser('email')//the property [email] does not exist
let obj=new proxy({},{
    set(target,property,value){
        if(property==='name'&&Object.prototype.toString.call(value)!=='[object String]'){
            throw  new Error(`The value for [${property} must be a string]`)
        }
        target[property]=value
    }
})
//let p= new Proxy(target,handler)
obj.name=1;//name must string
//格式化
//价值和类型修正
//数据绑定
//调试
//具有代理的API - 更复杂的示例
const api = new Proxy({}, {
    get(target, key, context) {
        return target[key] || ['get', 'post'].reduce((acc, key) => {
            acc[key] = (config, data) => {

                if (!config && !config.url || config.url === '') throw new Error('Url cannot be empty.');
                let isPost = key === 'post';

                if (isPost && !data) throw new Error('Please provide data in JSON format when using POST request.');

                config.headers = isPost ? Object.assign(config.headers || {}, { 'content-type': 'application/json;chartset=utf8' }) :
                    config.headers;

                return new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open(key, config.url);
                    if (config.headers) {
                        Object.keys(config.headers).forEach((header) => {
                            xhr.setRequestHeader(header, config.headers[header]);
                        });
                    }
                    xhr.onload = () => (xhr.status === 200 ? resolve : reject)(xhr);
                    xhr.onerror = () => reject(xhr);
                    xhr.send(isPost ? JSON.stringify(data) : null);
                });
            };
            return acc;
        }, target)[key];
    },
    set() {
        throw new Error('API methods are readonly');
    },
    deleteProperty() {
        throw new Error('API methods cannot be deleted!');
    }
});

/**
 * 循环遍历数据对象的每个属性
 */
function observable(obj) {
    if (!obj || typeof obj !== 'object') {
        return;
    }
    let keys = Object.keys(obj);
    keys.forEach((key) => {
        defineReactive(obj, key, obj[key])
    })
    return obj;
}
/**
 * 将对象的属性用 Object.defineProperty() 进行设置
 */
function Dep () {
    this.subs = [];
}
//创建消息订阅器 Dep:
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;
function defineReactive(data, key, val) {
    var dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function getter () {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function setter (newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    });
}
function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this; // 全局变量 订阅者 赋值
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        Dep.target = null; // 全局变量 订阅者 释放
        return value;
    }
};
function compileText(node, exp) {
    var self = this;
    var initText = this.vm[exp]; // 获取属性值
    this.updateText(node, initText); // dom 更新节点文本值
    // 将这个指令初始化为一个订阅者，后续 exp 改变时，就会触发这个更新回调，从而更新视图
    new Watcher(this.vm, exp, function (value) {
        self.updateText(node, value);
    });
}
/*属性描述符*/
// configurable，为true时，该属性描述符才能被改变！
// enumerable：为true时，属性才能够出现在对象的枚举属性中，默认是false！
// value：任意的javascript值，默认值是undefined
// writable：当且仅当该属性的writable为true时，value才能被改变！
// get：不多说了
// set：同～
/*属性描述符->获取当前属性*/
/*Object.getOwnPropertyDescriptor(obj, prop)*/
/*
{
    "writable":true,
    "enumerable":true,
    "configurable":true
    "value": () => { console.log(`I am ${this.name}`) }
}*/
