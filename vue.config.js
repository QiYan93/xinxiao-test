const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const is_prod = process.env.NODE_ENV === 'production';

module.exports = {
    productionSourceMap: false,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '',
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    // require('postcss-plugin-px2rem')({
                    //     rootValue: 37.5, //换算基数， 默认100，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                    //     // unitPrecision: 5, //允许REM单位增长到的十进制数字。
                    //     //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                    //     // propBlackList: [], //黑名单
                    //     exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                    //     // selectorBlackList: [], //要忽略并保留为px的选择器
                    //     // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                    //     // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                    //     mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
                    //     minPixelValue: 2 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                    // }),
                ]
            }
        }
    },
    chainWebpack: config => {
        if (process.env.use_analyzer) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
        }
    },
    configureWebpack: config => {
        const plugins = [
            // 只保留中文语言资源
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }),
            // 代码压缩
            new UglifyJsPlugin({
                uglifyOptions: {
                    //生产环境自动删除console
                    compress: {
                        drop_debugger: true,
                        drop_console: true,
                        pure_funcs: ['console.log']
                    }
                },
                sourceMap: false,
                parallel: true
            })
        ]
        // 仅在生产环境压缩，提高开发时的编译速度
        if (is_prod) {
            config.plugins = [...plugins, ...config.plugins];
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        // 提取公共模块
                        commons: {
                            chunks: 'all',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            name: 'common'
                        }                    
                    }
                },
            }
        }
    },
}