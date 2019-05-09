const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    },
    // configureWebpack: {
    //     // It will be merged into the final Webpack config
    //     optimization: {
    //     }
    // }
}