const express = require('express')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const { exec } = require('child_process')
const messages = require('./src/telegram/messages.json')
const { cronObserver, statsObserver } = require("./src/telegram")
const { START, MESSAGE, STATS, RUN_TESTS} = require('./src/telegram/commands')
const { startCheckPolling } = require("./src/telegram/utils")
const { getStats, getUserAvatar} = require("./src/telegram/modules/messages/helpers")
require('dotenv').config()

const { TOKEN, PORT, WEB_APP_URL } = process.env
const BOT = new TelegramBot(TOKEN, { polling: true })
const app = express()

app.use(express.json())
app.use(cors())

// Базовый механизм ответа на команду /start
BOT.onText(START,  async (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start
	try {
		await BOT.sendMessage(chatId, welcomeMessage)
		console.log(`Message sent to ${chatId} with web app button.`)
	} catch (error) {
		console.error(`Failed to send message to ${chatId}:`, error)
	}
})

// Запрос мини-приложения по команде /stats
BOT.onText(STATS,  async (msg) => {
	const chatId = msg.chat.id
	const opts = {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Open Web App', web_app: { url: WEB_APP_URL } }]
			]
		}
	}
	try {
		await BOT.sendMessage(msg.chat.id, "Welcome to the bot!", opts)
		console.log(`Message sent to ${chatId} with web app button.`)
	} catch (error) {
		console.error(`Failed to send message to ${chatId}:`, error)
	}
})

BOT.onText(RUN_TESTS,  async (msg) => {
	const chatId = msg.chat.id
	await BOT.sendMessage(chatId, `🚀 Тесты запущены. Ожидайте завершения.`)

	exec('npm test', (error, stdout, stderr) => {
		if (error) {
			BOT.sendMessage(chatId, `🆘 Тесты не прошли\n----------\n${stderr}`)
			return
		}
		BOT.sendMessage(chatId, `🟢 Все тесты прошли успешно\n----------\n${stdout}`)
	})
})

// Наблюдаем за временем и вызываем метод cronObserver (для дней рождения)
cron.schedule('0 02 00 * * *', () => cronObserver(BOT))

// Слушаем тип события message и вызываем метод сбора статистики
BOT.on(MESSAGE, (msg) => statsObserver(BOT, msg))

// Обработчики запросов
app.get('/stats', async (req, res) => {
	const stats = await getStats(BOT, TOKEN)
	res.setHeader('Content-Type', 'application/json')
	res.json(stats)
})
app.get('/me', async (req, res) => {
	const me = await BOT.getMe()
	res.setHeader('Content-Type', 'application/json')
	res.json({ me })
})
// Проверка, что поллинг с тг корректно работает
startCheckPolling(BOT)

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
