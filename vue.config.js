const path = require('path');
var BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    },
    configureWebpack: {
        plugins: [
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ],
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        }
    }
}