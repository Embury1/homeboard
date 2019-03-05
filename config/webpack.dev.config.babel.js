import path from 'path';

export default {
    server: {
        mode: 'development',
        devServer: {
            proxy: {
                '/api': process.env.API_BASE_URL
            }
        },
        plugins: [],
        rules: [

        ]
    },
    client: {
        mode: 'development',
        devServer: {},
        plugins: [

        ],
        rules: [
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
};
