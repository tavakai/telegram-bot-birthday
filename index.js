/* eslint-disable no-unused-vars */
const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const mustache = require('mustache')
const messages = require('./messages.json')
const commands = require('./commands.json')
const congrats = require('./congratulations.json')
require('dotenv').config()

const { TOKEN, GROUP_ID } = process.env

const timeZone = { timeZone: 'Europe/Moscow' }

const bot = new TelegramBot(TOKEN, { polling: true })

// Возвращает рандомный текст поздравления из файла congratulations.json
const randomCongratulation = (username) => {
	const max = Object.keys(congrats).length
  let rand = 0 + Math.random() * (max + 1 - 0);
  return mustache.render(congrats[Math.floor(rand)], { username })
}

// Отправляет напоминание
async function sendBirthdayReminder(username, groupId) {
	const message = mustache.render(messages.reminder, username)
	await bot.sendMessage(groupId, message, { chat_id: groupId, type: 'group' })
}

/**
 * Cron — популярный инструмент в Unix-системах, который помогает запланировать исполнение различных заданий прямо в ОС
 * https://www.ibm.com/docs/ru/urbancode-release/6.1.0?topic=interval-cron-expressions-defining-frequency
 */

cron.schedule('0 38 20 * * *', async () => {
	const today = new Date().toLocaleDateString('ru-RU', timeZone)
	const message = `🎉 Завтра у sdfsf день рождения! 🎂`
	await bot.sendMessage(GROUP_ID, message, { chat_id: GROUP_ID, type: 'group' })
	console.log({
		today
	})

	/**
	 * Ниже надо как-то проверять день рождения и высылать напоминание.
	 * Для напоминалки подготовлена функция sendBirthdayReminder
	 */

})

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start

	console.log({
		chatId, GROUP_ID
	})

	bot.sendMessage(GROUP_ID, welcomeMessage)
})

bot.onText(/\/add/, async (msg) => {
	const text = msg.text

	// if (text === commands.add) {
		const welcomeMessage = messages.commands.add.start

		await bot.sendMessage(GROUP_ID, welcomeMessage)

		bot.on('message', async (msg) => {
			const chatId = msg.chat.id

			// Для теста. Обрезаем входящее сообщение до формата ДД-ММ
			const getDate = msg.text.split('.').splice(0, 2).join('.')
			await bot.sendMessage(chatId, `Дата рождения - ${getDate}`)
		})
	// }
})
