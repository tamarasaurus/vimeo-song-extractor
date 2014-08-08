var ytdl = require('youtube-dl-vimeo');
var request = require('superagent');
var _ = require('underscore');
var config = require('./config');



var getTrackInfo = function(error, res) {
	console.log(res.body.response);
	if (res.body.response.status !== 0) {
		return;
	}
	// !_.isUndefined(res.body.response) && !_.isEmpty(res.body.response.track.title)
};


ytdl.getInfo('http://vimeo.com/45105236', function(err, data) {
	if (err) throw err;

	var format = data[data.length - 1].split(' - ');
	var video = {
		title: data[0],
		id: data[1],
		url: data[2],
		thumbnail: data[3],
		description: data.slice(4, data.length - 2).join('\n'),
		filename: data[data.length - 2],
		format: format[0],
		resolution: format[1]
	};

	request
		.post('http://developer.echonest.com/api/v4/track/upload')
		.send({
			api_key: config.api_key,
			url: video.url,
			filetype: 'mp4'
		})
		.type('form')
		.end(function(error, res) {
			getTrackInfo(error, res);
		});
});