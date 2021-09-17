const http = require("http");
const server = http.createServer();
server.on('request',(req,res)=>{
    // 使用es6的扩展运算符过滤请求头,提出host connection
    var { connection, host, ...originHeaders } = req.headers;
    // 构造请求报文
    var options = {
        "method": req.method,
        "hostname": "127.0.0.1",
        "port": "80",
        "path": req.url,
        "headers": { originHeaders }
    }
    // 通过req的data事件和end事件接收客户端发送的数据
    // 并用Buffer.concat处理一下
    let postbody = [];
    req.on("data", chunk => {
        postbody.push(chunk);
    })
    req.on('end', () => {
        let postbodyBuffer = Buffer.concat(postbody);
        // 定义变量接收目标服务器返回的数据
        let responsebody=[]
        // 发送请求头
        var request = http.request(options, (response) => {
            response.on('data', (chunk) => {
                responsebody.push(chunk)
            })
            response.on("end", () => {
                // 处理目标服务器数据,并将其返回给客户端
                responsebodyBuffer = Buffer.concat(responsebody)
                res.end(responsebodyBuffer);
            })
        })
        // 将接收到的客户端请求数据发送到目标服务器;
        request.write(postbodyBuffer)
        request.end();
        
    })
})
server.listen(3000,()=>{
    console.log("running");
})