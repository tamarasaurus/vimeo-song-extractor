var express = require('express');
var Extractor = require('./index'),
	extractor = new Extractor(),
	_ = require('underscore'),
	app = express();


app.get('/get', function(req, res) {
	extractor.getVideoStream(req.query.video, function(data){
		console.log(data);
		if(_.isUndefined(data.track)){
			res.json(data);
		}else{
			res.redirect('/track/'+data.track.id);
		}
	});
});

app.get('/track/:id', function(req, res) {
	console.log('identify track from echonest: ', req.params.id);
	extractor.getTrackStatus(req.params.id, function(data){
		res.json(data.body);
	});
});

extractor.events.on('error', function(msg) {
	console.log('error: ', msg);
});

app.listen(3000);