
// const http=require('http');
// const server=http.createServer(callBack);
// function callBack(request,response){
//     response.writeHead(200,{
//         "Content-Type":"text/html;charset=UTF-8",
//         "Access-Control-Allow-Origin":"*"
//     });
//     //response.send({status:1,msg:"响应成功"});
//     response.end('哈哈哈哈');
// }
// server.listen(8082,()=>{
//     console.log('开启成功')
// })

// let xhr=window.XMLHttpRequest?new XMLHttpRequest():ActiveXObject('microsoft.XMLHttp');
// xhr.open('GET', 'http://192.168.2.142:8082', true);
// xhr.onreadystatechange=function() {
//     if(xhr.readyState==4&&xhr.status===200){
//         let data=JSON.parse(xhr.responseText);
//         console.log(data)
//     }   
// }
// // xhr.upload.addEventListener('progress', function (e) {
// //    //Math.round((e.loaded * 100) / e.total);
// // }, false);
// //xhr.abort()
// if (type.toLowerCase() === 'post') {
//     //给指定的HTTP请求头赋值
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
// }
// xhr.send()
// class Pub {
//     constructor(){
//         this.collection={}
//     }
//     add(eventType,handlers){
//         (this.collection[eventType]||(this.collection[eventType]=[])).push(handlers)
//     }
//     emit(eventType){
//         let arms = [].slice.call(arguments,1);
//         this.collection[eventType].forEach(fns=>{
//             fns.apply(this,arms)
//         })
//     }
//     del(eventType,handler){
//         let handlers = this.collection[eventType];
//         if(!handlers)return this.collection[eventType] = [];
//         if(handlers && handlers.length){
//             handlers.forEach((currentFn,i)=>{
//                 currentFn == handler && handlers.splice(i,1)
//             })
//         }
      
//     }
// }
// let pub = new Pub();
// pub.add('cf',cf)
// pub.add('sj',sj)
// pub.emit('cf')
// pub.del('cf',cf)
// console.log(pub)
// function cf(){
//     console.log('cf')
// }
// function sj(){
//     console.log('sj')
// }


// class Subject{
//     constructor(arm){
//         this.collect=[];
//     }
//     add(obj){
//         this.collect.push(obj)
//     }
//     update(context){
//         this.collect.forEach(item=>{
//             item.notifiy(context)
            
//         })
//    }
// }
// class Watcher{
//     constructor(){
       
//     }
//     notifiy(context){
//         console.log(context)
//     }
// }
// let a = new Subject();
// a.add(new Watcher());
// a.update('添加了一个观察者')
