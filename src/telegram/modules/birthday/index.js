const congrats = require('./congratulations.json')
const listOfBirthdays = require('./birthdays')
require('dotenv').config()

const { TEST_GROUP_ID } = process.env
const timeZone = { timeZone: 'Europe/Moscow' }

// Возвращает рандомный текст поздравления из файла congratulations.json
const randomCongratulation = () => {
  const max = Object.keys(congrats).length
  const rand = Math.floor(Math.random() * (max - 1 + 1)) + 1
  return congrats[rand]
}

// проверка дней рождения с текущей датой
async function checkDateBirth(bot, today, listOfBirthdays) {
  listOfBirthdays.forEach((el) => {

    let result
    if (el.date === today) {
      if (el.name.length > 1) {
        result = el.name.join(' и ')
      } else {
        result = el.name
      }
      const congratulation = randomCongratulation();
      const message = `🎉 Сегодня ${today} у ${result} День Рождения! 🎂\n\n${congratulation}`;
      bot.sendMessage(TEST_GROUP_ID, message, { chat_id: TEST_GROUP_ID, type: 'group' });
    }
  })
}

const cronObserver = async () => {
  const fullDate = new Date().toLocaleDateString('ru-RU', timeZone)
  const parts = fullDate.split('.') // Разбиваем строку по точкам
  const today = parts[0] + '.' + parts[1];  // Объединяем день и месяц в одну строку

  await checkDateBirth(today, listOfBirthdays)
}

module.exports = {
  cronObserver
}
