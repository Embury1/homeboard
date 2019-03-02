import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import workboxPlugin from 'workbox-webpack-plugin';
import Dotenv from 'dotenv-webpack';

import devCfg from './config/webpack.dev.config.babel';
import prodCfg from './config/webpack.prod.config.babel';

const env = process.env.NODE_ENV;

const cfg = (
    env === 'production'
        ? prodCfg
        : devCfg
);

// common configuration
export default [
    // client
    {
        mode: cfg.client.mode,
        entry: path.resolve('src/www/app/App.jsx'),
        output: {
            path: path.resolve('dist/assets'),
            filename: 'bundle.js',
            publicPath: '/'
        },
        devServer: {
            ...cfg.client.devServer
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve('src/www/index.html'),
                filename: 'index.html',
                inject: 'body'
            }),
            ...cfg.client.plugins,
            new workboxPlugin.InjectManifest({
                swSrc: path.join('src', 'sw.js')
            }),
            new Dotenv()
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                ...cfg.client.rules
            ]
        }
    },
    // server
    {
        mode: cfg.server.mode,
        entry: path.resolve('src/api/index.js'),
        output: {
            path: path.resolve('dist'),
            filename: 'server.js'
        },
        target: 'node',
        externals: [
            nodeExternals()
        ],
        devServer: {
            ...cfg.server.devServer
        },
        plugins: [
            ...cfg.server.plugins
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                ...cfg.server.rules
            ]
        }
    }
];
