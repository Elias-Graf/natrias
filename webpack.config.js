const path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname),
		port: 9000,
		watchContentBase: true,
		hot: true,
		quiet: true,
	},
	entry: './src/client/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: 'build',
	},
};
