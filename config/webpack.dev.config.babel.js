import NodemonPlugin from 'nodemon-webpack-plugin';
import path from 'path';

export default {
    server: {
        devServer: {
            proxy: {
                '/api': 'http://localhost:8081'
            }
        },
        plugins: [
            new NodemonPlugin({
                script: path.resolve('dist/server.js'),
                ignore: [
                    path.resolve('dist/assets/**')
                ]
            })
        ],
        rules: [
            
        ]
    },
    client: {
        devServer: { },
        plugins: [

        ],
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    }
};