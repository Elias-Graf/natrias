const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, './src/client'),
		port: 9000,
		watchContentBase: true,
		hot: true,
	},
	entry: './src/client/index.ts',
	mode: 'development',
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
		extensions: ['.ts', '.js'],
		plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
	},
};
