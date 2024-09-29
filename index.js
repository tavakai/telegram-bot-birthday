const express = require('express')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const messages = require('./src/telegram/messages.json')
const { cronObserver, statsObserver } = require("./src/telegram")
const { START, MESSAGE } = require('./src/telegram/commands')
const { startCheckPolling } = require("./src/telegram/utils")
const { getStats, getUserAvatar} = require("./src/telegram/modules/messages/helpers")
require('dotenv').config()

const { TEST_TOKEN, PORT } = process.env
const BOT = new TelegramBot(TEST_TOKEN, { polling: true })
const app = express()

app.use(express.json())
app.use(cors())

// Базовый механизм ответа на команду /start
BOT.onText(START, (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start

	BOT.sendMessage(chatId, welcomeMessage)
})

// Наблюдаем за временем и вызываем метод cronObserver (для дней рождения)
cron.schedule('0 02 00 * * *', () => cronObserver(BOT))

// Слушаем тип события message и вызываем метод сбора статистики
BOT.on(MESSAGE, (msg) => statsObserver(BOT, msg))

app.get('/stats', async (req, res) => {
	const stats = await getStats()
	res.send(stats).json()
})
app.get('/avatar', async (req, res) => {
	const avatar = await getUserAvatar(BOT)
	res.send(avatar).json()
})

startCheckPolling(BOT)
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
