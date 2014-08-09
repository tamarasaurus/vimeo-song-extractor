var express = require('express');
var Extractor = require('./index'),
	extractor = new Extractor(),
	app = express();


app.get('/get', function(req, res) {
	extractor.getVideoStream(req.query.video, res);
});

extractor.events.on('start', function(data) {
	console.log('start identifying: ', data.track.id);
	extractor.getTrackStatus(data.track.id);
});

extractor.events.on('error', function(msg) {
	console.log('error: ', msg);
});

extractor.events.on('poll', function(data, res) {
	console.log('track_info: ', data.body);
	res.json(data.body);
});

app.listen(3000);