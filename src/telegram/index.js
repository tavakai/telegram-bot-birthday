const { cronObserver } = require('./modules/birthday')
const { sendStatsMessage } = require('./modules/messages')
const { updateStats } = require("./modules/messages/helpers");
const { STATS, START } = require('./commands')

/*
 * Создаем буфер сообщений, который будет периодически обрабатываться
 * чтобы не обрабатывать каждое сообщение в группе
 * во избежание перегрузок на бота и сервер
 */

let messagesBuffer = []
let batchTimer = null
const BATCH_INTERVAL = 10000

const processMessageBatch = async () => {
  if (messagesBuffer.length === 0) {
    clearInterval(batchTimer) // Останавливаем таймер, если буфер пуст
    batchTimer = null // Сброс таймера
    return
  }

  console.log(`Processing ${messagesBuffer.length} messages in batch...`)

  for (const msg of messagesBuffer) {
    await updateStats(msg)
  }
  messagesBuffer = []
}

// Динамическое управление таймером
const startBatchProcessing = () => {
  if (!batchTimer) {
    batchTimer = setInterval(processMessageBatch, BATCH_INTERVAL)
  }
}

const statsObserver = async (bot, msg) => {
  messagesBuffer.push(msg)
  startBatchProcessing()

  if (msg.text === STATS) {
    await sendStatsMessage(bot, msg)
  }
}

module.exports = {
  cronObserver,
  statsObserver
}
