/* eslint-disable no-undef */
require('dotenv').config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const dialogflow = require('./dialogflow');
const youtube = require('./youtube');
// const configs = require('./configs/FitBotTelegram');

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	let dfResponse = null;

	try {
		dfResponse = await dialogflow.sendMessage(chatId.toString(), msg.text);
	} catch (err) {
		dfResponse = { text: `Deu merda vei - ${err}` };
	}

	let textResponse = dfResponse.text;
	if (dfResponse.intent === 'Treino Específico') {
		try {
			textResponse = await youtube.searchVideoURL(textResponse, msg.text);
		} catch (err) {
			textResponse = 'Deu merda' + err;
		}
	}
    
	bot.sendMessage(chatId, textResponse);
});