vimeo-song-extractor
====================

Extract songs from vimeo and get song details using echonest


instructions
===================

1. Make a config.js file in the root folder that looks like this:

```javascript
module.exports = {
    api_key: '[your echonest api key]'
};
```

2. Run ```node example``` to run an example application

3. Go to ```http://localhost:3000/get?video=[full vimeo url]```


docs
====================

## extractor()

Constructor

## errors

Error messages

### postTrack

* **String** - *stream* - An mp4 from a Vimeo stream

### getVideoStream

* **String** -  *url* - The full vimeo URL
* **Object** -  *res* - The response object to pass

### getTrackStatus

* **String** - *id* - The track id from echonest