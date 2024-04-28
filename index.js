const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const messages = require('./src/telegram/messages.json')
const { cronObserver, messagesObserver } = require("./src/telegram")
const { START, MESSAGE } = require('./src/telegram/commands')
const { startCheckPolling } = require("./src/telegram/utils")
require('dotenv').config()

const { TEST_TOKEN } = process.env
const BOT = new TelegramBot(TEST_TOKEN, { polling: true })


BOT.onText(START, (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start

	BOT.sendMessage(chatId, welcomeMessage)
})

cron.schedule('0 01 00 * * *', cronObserver)
BOT.on(MESSAGE, (msg) => {
	messagesObserver(BOT, msg)
})


// BOT.onText(GET_MESSAGES, async (msg) => {
// 	const messagesCount = await TotalMessage.findOne()
// 	BOT.sendMessage(msg.chat.id, `Отправлено сообщений - ${messagesCount.total}`)
// })

startCheckPolling(BOT)
