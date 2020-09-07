const YouTube = require('youtube-node');
const config = require('./configs/youtube');

const youtube = new YouTube();

youtube.setKey(config.key);

function searchVideoURL(message, queryText) {
	return new Promise((resolve) => {
		youtube.search(`Exercício em casa para ${queryText}`, 5, function(error, result) {
			if (error) {
				resolve('Deu merda');
			} else { 
				const videoIds = result.items.map((item) => item.id.videoId).filter(item => item);
				const youtubeLinks = videoIds.map(videoId => `https://www.youtube.com/watch?v=${videoId}`).join('\n');

				resolve(`${message} ${youtubeLinks}`);
			}
		});
	});
}

module.exports.searchVideoURL = searchVideoURL;