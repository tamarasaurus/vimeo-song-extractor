/**
 * module extractor
 * @author Tamara Chahine
 * @type {Function}
 */

var ytdl = require('youtube-dl-vimeo');
var request = require('superagent'),
config = require('./config'),
events = require('events');


module.exports = (function() {
    /**
     * Constructor
     */
	var extractor = function() {
		this.events = new events.EventEmitter();
	};

    /**
     * Error messages
     * @type {Object}
     */
	var errors = {
		echonest: 'There was an error getting data from echonest',
		stream: 'There was an error getting the video stream url ',
		status: 'There was an error getting the track status'
	};

	extractor.prototype = {
        /**
         * postTrack
         * @desc Post a Vimeo stream mp4 to the echonest api
         * @param  {String} stream An mp4 from a Vimeo stream
         */
		postTrack: function(stream, cb) {
            console.log('getVideoStream', stream);
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
                    cb.call(null, res.body.response);
				});
		},
        /**
         * getVideoStream
         * @desc Get an mp4 stream from a Vimeo video
         * @param  {String} url The full vimeo URL
         * @param  {Object} res The response object to pass
         */
		getVideoStream: function(url, cb) {
            console.log('getVideoStream: ', url);
			var _this = this;
			ytdl.getInfo(url, function(err, data) {
				if (err) {
					return _this.events.emit('error', errors.stream);
				}
				_this.postTrack(data[2], cb);
			});
		},
        /**
         * getTrackStatus
         * @desc Get the status of a track that's currently being analysed by echonest
         * @param  {String} id The track id from echonest
         */
		getTrackStatus: function(id, cb) {
            console.log('getTrackStatus: ', id);
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
                    cb.call(null, res);
                });
		}
	};

	return extractor;
}());