const http= require('http');
const server=http.createServer((request,response)=>{
    response.end('1');
})
server.listen('8081',()=>{
    console.info(`server is ok`)
})