const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const messages = require('./src/telegram/messages.json')
const {	cronObserver	} = require("./src/telegram/modules/birthday")
const { START } = require('./src/telegram/commands')
const {	startCheckPolling} = require("./src/telegram/utils")
require('dotenv').config()

const { TOKEN } = process.env
const BOT = new TelegramBot(TOKEN, { polling: true })

cron.schedule('0 02 00 * * *', () => cronObserver(BOT))

BOT.onText(START, (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start

	BOT.sendMessage(chatId, welcomeMessage)
})

startCheckPolling(BOT)
