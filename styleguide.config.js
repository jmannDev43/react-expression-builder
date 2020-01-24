module.exports = {
	components: 'src/Test.js',
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}
			]
		}
	}
}
