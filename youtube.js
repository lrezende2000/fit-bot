/* eslint-disable no-undef */
require('dotenv').config();
const YouTube = require('youtube-node');
// const config = require('./configs/youtube');

const youtube = new YouTube();

youtube.setKey(process.env.YOUTUBE_KEY);

function searchVideoURL(message, queryText, intent) {
	return new Promise((resolve) => {
    
		const youtubeSearch = intent === 'Treinos' ? `Exercícios de ${queryText} em casa` : queryText;
    
		youtube.search(youtubeSearch, 3, function(error, result) {
			if (error) {
				resolve(['Alguma coisa não deu certo', []]);
			} else {
				const videoIds = result.items.map((item) => item.id.videoId);
				const youtubeLinks = videoIds.map((videoId) => `https://www.youtube.com/watch?v=${videoId}`);

				resolve([message, youtubeLinks]);
			}
		});
	});
}

module.exports.searchVideoURL = searchVideoURL;