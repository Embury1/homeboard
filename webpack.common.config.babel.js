import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import workboxPlugin from 'workbox-webpack-plugin';
import Dotenv from 'dotenv-webpack';

// common configuration
export default {
    client: {
        entry: path.resolve('src/www/app/App.jsx'),
        target: 'web',
        output: {
            path: path.resolve('dist/assets'),
            filename: 'bundle.js',
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve('src/www/index.html'),
                filename: 'index.html',
                inject: 'body'
            }),
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
                {
                    test: /\.css$/,
                    //exclude: /node_modules/,
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
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        'file-loader?limit=10000'
                        //'url-loader?limit=100000'
                    ]
                }
            ]
        }
    },
    server: {
        entry: path.resolve('src/api/index.js'),
        target: 'node',
        node: {
            __filename: false,
            __dirname: false
        },
        output: {
            path: path.resolve('dist'),
            filename: 'server.js'
        },
        externals: [
            nodeExternals()
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        }
    }
};
