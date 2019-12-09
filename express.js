// express:一个基于node平台的框架 轻量 高效 使用便捷 功能急速开启一个web应用
// express 的主要内容 路由操作 中间件  模板引擎
// 路由操作 加载文件
//中间处理过程
// 把路由操作分化处理
//路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。（就是定义一个url请求地址以及当此地址url被匹配时给出对应的服务端响应）
// 路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，它的结构如下： app.METHOD(path, [callback...], callback)， app 是 express 对象的一个实例， METHOD 是一个 HTTP 请求方法， path 是服务器上的路径， callback 是当路由匹配时要执行的函数。
//路由处理 app.get()处理get请求，app.post()处理psot请求 app.method(要匹配的url，处理响应的回调函数)
//导入express模块
var express=require("express");
var path=require("path");
var url=require("url");
var fs=require("fs");
var query=require("querystring");
var bodyParser=require("body-parser");
// 开启web应用
var app=express();//实质就是http的createServer；
//各种路由操作就写在这里
//使用bodyParser解析Post参数
app.use(bodyParser.urlencoded({extended:false}));//只能解析enctype="application/x-www-form-urlencoded"
app.use(bodyParser.json());//只能解析application/json
app.get("/",function (req,res) {
    // res.end("这是根目录的响应");
    // res.send("这是根目录的响应");//自带方法 结束并响应 自己设置了响应头 这边比end强大 可以返回一个对象
    // res.send({status:1,msg:"响应成功"});
    var abPath=path.resolve("index.html");
    res.sendFile(abPath);//参数必须时一个绝对路径
});
//处理post请求
app.post("/post",function (req,res) {
    //获取post请求的参数
    //console.log(req.body);//借助中间件body.parse解析
    var str="";
    req.on("data",function (chunk) {
        str +=chunk;//拼接每次流动所得的数据
    });
    req.on("end",function(){
        var query=querystring.parse(str);
        console.log(query);
    });

    res.end("this is action=post");
})
//加载任何文件的处理
app.get("*",function (req,res) {
    //匹配以上生于的所有路径
    var pathname="."+req.path;
    var abpath=path.resolve(pathname);
    if(fs.existsSync(pathname)){
        res.sendFile(abpath);
    }else {
        //res.status(404).send("<h1>NOT FOUND</h1>>");
        res.status(404).sendFile(path.resolve("404.html"));
        //res.sendFile(path.resolve("404.html"));
        //res.sendStatus(404);
    }
});
/* app.get("*",function (req,res) {
     console.log(req.url);//请求地址
     console.log(req.path);//请求为文件名
     console.log(req.query.user);//请求的参数
     console.log(req.hostname);//主机名
    // console.log(req.cookies);//存的cookie 需要另一个cookies-parse辅助使用
     res.send(req.path);
 })*/
//res.se
// nd("当前路径为"+req.path);//当前请求的文件名
app.listen(7000);