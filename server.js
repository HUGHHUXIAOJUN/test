const http= require('http');
const server=http.createServer((request,response)=>{
    response.end('1');
})
server.listen('8081',()=>{
    console.info(`server is ok`)
})

const webpack = require("webpack");
const  fs =require('fs');
const path = require("path");
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://house.madridwine.cn/app',
                ws: true,
                changeOrigin: true,
                secure:false,
                pathRewrite: {
                    '^/api': ''//这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替
                    //比如我要调用'http://40.00.100.133:3002/user/login'，直接写‘/api/user/login'即可
                }
            }
        },
        //http2: true,
        port: 8001
    },
    publicPath: process.env.NODE_ENV === 'production'? './': './',
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery"
            })
        ],
        performance: {
            hints:'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "src/assets/css/mixin.less")]
        }
    },
    transpileDependencies: ['webpack-dev-server/client'],
    chainWebpack: (config) => {
        config.entry.app = ['babel-polyfill', './src/main.js'];
    },
    productionSourceMap:false,
    crossorigin:'anonymous',
    // transpileDependencies: []
}
