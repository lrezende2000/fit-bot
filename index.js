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
	if (dfResponse.intent === 'Treino Específico') {
		const muscle = dfResponse.fields.Muscles.stringValue;
		const [message, youtubeLinks] = await youtube.searchVideoURL(textResponse, muscle);
		if (youtubeLinks.length !== 0) {
			youtubeLinks.map((yL) => {
				textResponse = `${message} ${yL}`;
				bot.sendMessage(chatId, textResponse);
			});
		} else {
			textResponse = message;
			bot.sendMessage(chatId, textResponse);
		}
	}

	if (dfResponse.intent !== 'Treino Específico') {
		if(msg.chat.type === 'group' && dfResponse.intent === 'Default Fallback Intent') {
			return;
		}
		bot.sendMessage(chatId, textResponse);
	}
});