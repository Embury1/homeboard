import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
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
        entry: path.resolve('src/www/app/index.js'),
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
            ...cfg.client.plugins
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
