var ytdl = require('youtube-dl-vimeo');
var request = require('superagent'),
config = require('./config'),
events = require('events');

module.exports = (function() {
	var extractor = function() {
		this.events = new events.EventEmitter();
	};

	var errors = {
		echonest: 'There was an error getting data from echonest',
		stream: 'There was an error getting the video stream url ',
		status: 'There was an error getting the track status'
	};

	// add to the queue after posttrack
	extractor.prototype = {
		postTrack: function(stream) {
			var _this = this;
			request
				.post('http://developer.echonest.com/api/v4/track/upload')
				.send({
					api_key: config.api_key,
					url: stream,
					filetype: 'mp4'
				})
				.type('form')
				.end(function(error, res) {
					if (error) {
						_this.events.emit('error', errors.echonest);
					}
					_this.events.emit('start', res.body.response);
				});
		},
		getVideoStream: function(url, res) {
            this.res = res;
			var _this = this;
			ytdl.getInfo(url, function(err, data) {
				if (err) {
					return _this.events.emit('error', errors.stream);
				}
				_this.postTrack(data[2]);
			});
		},
		getTrackStatus: function(id) {
			var _this = this;
            request.get('http://developer.echonest.com/api/v4/track/profile')
                .query({
                    api_key: config.api_key,
                    id: id,
                    format: 'json',
                    bucket: 'audio_summary'
                }).end(function(err, res) {
                    if (err) {
                        return _this.events.emit('error', errors.status, err);
                    }
                    _this.events.emit('poll', res, _this.res);
                });
		}
	};

	return extractor;
}());