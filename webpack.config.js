var webpack = require('webpack');
var dotenv = require('dotenv').config();
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var paths = {
    'js': {
        'entry': './wp-content/themes/' + process.env.WP_THEME + '/assets/js/main.js',
    },
    'sass': {
        'entry': './wp-content/themes/' + process.env.WP_THEME + '/assets/sass/main.scss',
    },
    'proxy': '/wp-content/themes/' + process.env.WP_THEME + '/inc/js/app.js',
    'output': './wp-content/themes/' + process.env.WP_THEME + '/inc/'
}

module.exports = {
    entry: [
        'webpack-hot-middleware/client?reload=true',
        paths.js.entry,
        paths.sass.entry
    ],
    output: {
        path: path.resolve(__dirname, paths.output),
        filename: 'js/bundle.js',
        // publicPath: 'http://localhost:3000/wp-content/themes/' + process.env.WP_THEME + '/inc/js/'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader'])
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
            }
        ]
    },
    devServer: {
        quiet: false,
        stats: { colors: true },
        proxy: {
            '*': {
                target: {
                    'host': process.env.WP_SITE.replace(/(^\w+:|^)\/\//, ''),
                    'protocol': 'http:',
                    'port': 80
                },
                secure: false,
                ignorePath: false,
                changeOrigin: true
            }
        },
        inline: true,
        hot: true,
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/app.css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
		    '$': 'jquery',
		    'jQuery': 'jquery',
		    'window.jQuery': 'jquery'
		}),
        new webpack.HotModuleReplacementPlugin()
    ],
}
