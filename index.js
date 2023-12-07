const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const messages = require('./messages.json')
const congrats = require('./congratulations.json')
const listOfBirthdays = require('./birthdays.js')
const { TOKEN, GROUP_ID } = require('./constants.js')

const timeZone = { timeZone: 'Europe/Moscow' }

const bot = new TelegramBot(TOKEN, { polling: true })

// Возвращает рандомный текст поздравления из файла congratulations.json
const randomCongratulation = () => {
	const max = Object.keys(congrats).length
	const rand = Math.floor(Math.random() * (max - 1 + 1)) + 1
	return congrats[rand]
}

// проверка дней рождения с текущей датой
async function checkDateBirth(today, listOfBirthdays) {
	listOfBirthdays.forEach((el) => {
	
		let result;
		if (el.date === today) {
			if (el.name.length > 1) {
				result = el.name.join(' и ')
			} else {
				result = el.name
			}
			const congratulation = randomCongratulation();
			const message = `🎉 Сегодня ${today} у ${result} День Рождения! 🎂\n\n${congratulation}`;
			bot.sendMessage(GROUP_ID, message, { chat_id: GROUP_ID, type: 'group' });
		} 
	})
}

cron.schedule('0 35 02 * * *', async () => {
	const fullDate = new Date().toLocaleDateString('ru-RU', timeZone)
	const parts = fullDate.split('.') // Разбиваем строку по точкам
	const today = parts[0] + '.' + parts[1];  // Объединяем день и месяц в одну строку
	
	await checkDateBirth(today, listOfBirthdays)
})

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id
	const welcomeMessage = messages.greetings.start

	bot.sendMessage(chatId, welcomeMessage)
})

console.log('Bot success start')