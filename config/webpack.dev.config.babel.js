import path from 'path';

export default {
    server: {
	devServer: {
	    proxy: {
		'/api': 'http://localhost:8081'
	    }
	},
	plugins: [ ],
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
