/* eslint-disable no-undef */
require('dotenv').config();
const YouTube = require('youtube-node');
// const config = require('./configs/youtube');

const youtube = new YouTube();

youtube.setKey(process.env.YOUTUBE_KEY);

function searchVideoURL(message, queryText) {
	return new Promise((resolve) => {
		youtube.search(`Exercícios de ${queryText} em casa`, 3, function(error, result) {
			if (error) {
				resolve(['Alguma coisa não deu certo', []]);
			} else { 
				const videoIds = result.items.map((item) => item.id.videoId).filter(item => item);
				const youtubeLinks = videoIds.map((videoId) => `https://www.youtube.com/watch?v=${videoId}`);

				resolve([message, youtubeLinks]);
			}
		});
	});
}

module.exports.searchVideoURL = searchVideoURL;