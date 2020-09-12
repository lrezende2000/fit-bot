/* eslint-disable no-undef */
require('dotenv').config();
process.env['NTBA_FIX_319'] = 1;
const TelegramBot = require('node-telegram-bot-api');
const dialogflow = require('./dialogflow');
const youtube = require('./youtube');
// const configs = require('./configs/FitBotTelegram');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;

	const dfResponse = await dialogflow.sendMessage(chatId.toString(), msg.text);

	let textResponse = dfResponse.text;
	if (dfResponse.intent === 'Treinos' || dfResponse.intent === 'Treino Específico') {
		const searchOnYoutube = dfResponse.intent === 'Treinos'
			? dfResponse.fields.Muscles.stringValue
			: dfResponse.fields.Exercises.stringValue.split(':')[1];
		const [message, youtubeLinks] = await youtube.searchVideoURL(textResponse, searchOnYoutube, dfResponse.intent);
		if (youtubeLinks.length !== 0) {
			textResponse = `Estou te enviando alguns vídeos de ${message.split(':')[1]}`;
			bot.sendMessage(chatId, textResponse);
			youtubeLinks.map((yL) => {
				bot.sendMessage(chatId, yL);
			});
		} else {
			textResponse = message;
			bot.sendMessage(chatId, textResponse);
		}
	}

	if (dfResponse.intent !== 'Treinos' && dfResponse.intent !== 'Treino Específico') {
		if(msg.chat.type === 'group' && dfResponse.intent === 'Default Fallback Intent') {
			return;
		}
		bot.sendMessage(chatId, textResponse);
	}
});