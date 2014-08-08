var ytdl = require('youtube-dl-vimeo');
var url = 'http://vimeo.com/93491987';
var echojs = require('echojs');
var fs = require('fs'),
request = require('superagent');

var echo = echojs({
  key: process.env.ECHONEST_KEY
});



ytdl.getInfo(url, function(err, data) {
    if (err) throw err;

    var format = data[data.length - 1].split(' - ');
    var video = {
      title       : data[0],
      id          : data[1],
      url         : data[2],
      thumbnail   : data[3],
      description : data.slice(4, data.length - 2).join('\n'),
      filename    : data[data.length - 2],
      format        : format[0],
      resolution  : format[1]
    };


    console.log(video.url);
    var posted = echo('track/upload').post({
        filetype: 'mp3',
        format:'json'
      }, 'application/octet-stream', 'http://www.tonycuffe.com/mp3/girlwho.mp3', function (err, json) {
        // console.log(err, json);
      });


    // request.get(video.url).end(function(e, res){
    //     console.log(e, res.body)
    // });

    // fs.readFile(video.url, function (err, buffer) {
    //     console.log(err, buffer);

    //   echo('track/upload').post({
    //     filetype: 'mp4'
    //   }, 'application/octet-stream', buffer, function (err, json) {
    //     console.log(err, json);
    //   });
    // });

}
);

