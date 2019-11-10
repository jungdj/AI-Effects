const webpack = require("webpack");

module.exports = function override(config, env) {
	// Extend the config to work with the videojs-record project without ejecting create react app.
	// Reference: https://github.com/collab-project/videojs-record/wiki/React
	// Instead of ejecting apply webpack config changes here.
	const videojsPlugin = new webpack.ProvidePlugin({
		videojs: "video.js/dist/video.cjs.js",
		RecordRTC: "recordrtc"
	});
	const videojsAlias = {
		videojs: "video.js",
		WaveSurfer: "wavesurfer.js",
		RecordRTC: "recordrtc"
	};
	config.resolve.alias = { ...config.resolve.alias, ...videojsAlias };
	config.plugins.push(videojsPlugin);
	return config;
};
