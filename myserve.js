const express=require("express");
const app=express();
const path=require("path");
const fs = require("fs");
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function (req,res) {
     var abPath=path.resolve("login.html");
     res.sendFile(abPath);
});
app.post("/login",function (req,res) {
    console.log('post')
    var str="";
    req.on("data",function (chunk) {
        str +=chunk;
    });
    req.on("end",function(){
        var query=querystring.parse(str);
        console.log(query);
    });

    res.end("this is action=post");
})
app.get("*",function (req,res) {
    //console.log(req.url);//请求地址
    //console.log(req.path);//请求为文件名
    //console.log(req.query.user);//请求的参数
    //console.log(req.hostname);//主机名
   // console.log(req.cookies);//存的cookie 需要另一个cookies-parse辅助使用
    res.send(req.path);
    res.status(404).send(JSON.stringify(req));
    var pathname="."+req.path;
    var abpath=path.resolve(pathname);
    if(fs.existsSync(pathname)){
        res.sendFile(abpath);
    }else {
        res.status(404).send("<h1>NOT FOUND</h1>");
    }
});


app.listen(7000,()=>{
    console.log('服务已开启')
});
