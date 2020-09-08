/* eslint-disable no-undef */
require('dotenv').config();
const dialogflow = require('dialogflow');
// const configs = require('./configs/FitBotDialogFlow');

const sessionClient = new dialogflow.SessionsClient({
	projectId: process.env.DIALOGFLOW_PROJECT_ID,
	credentials: { private_key: process.env.DIALOGFLOW_PRIVATE_KEY, client_email: process.env.DIALOGFLOW_CLIENT_EMAIL }
});

async function sendMessage(chatId, message) {
	const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECT_ID, chatId);

	const request = {
		session: sessionPath,
		queryInput: {}
	};

	const textQueryInput = { text: { text: message, languageCode: 'pt-BR' } };

	const eventQueryInput = { event: { name: 'start', languageCode: 'pt-BR' } };

	request.queryInput = message === '/start' ?  eventQueryInput : textQueryInput;

	let responses;
	try {
		responses = await sessionClient.detectIntent(request);
	} catch (err) {
		responses = [
			{
				fulfillmentText: '',
				intent: {
					displayName: ''
				},
				parameters: {
					fields: ''
				}
			}
		];
	}

	const result = responses[0].queryResult;

	return { text: result.fulfillmentText, intent: result.intent.displayName, fields: result.parameters.fields };
}

module.exports.sendMessage = sendMessage;