const TelegramBot = require('node-telegram-bot-api');
const dialogflow = require('./dialogflow');
const youtube = require('./youtube');
const configs = require('./configs/FitBotTelegram');

const token = configs.token;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;

	const dfResponse = await dialogflow.sendMessage(chatId.toString(), msg.text);

	let textResponse = dfResponse.text;
	if (dfResponse.intent === 'Treino Específico') {
		textResponse = await youtube.searchVideoURL(textResponse, msg.text);
	}
    
	bot.sendMessage(chatId, textResponse);
});