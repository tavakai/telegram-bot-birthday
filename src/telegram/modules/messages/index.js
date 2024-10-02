const { getStats } = require('./helpers')

const sendStatsMessage = async (BOT, msg) => {
  try {
    const {
      totalMessagesCount,
      totalStickersCount,
      totalAnimationsCount,
      topUsers,
    } = await getStats()

    let response = `Общая статистика чата\n`

    response += `Cообщений отправлено: ${totalMessagesCount}\n`
    response += `Стикеры: ${totalStickersCount}\n`
    response += `Анимации: ${totalAnimationsCount}\n\n`
    response += `Топ-5 участников по количеству сообщений:\n`

    topUsers.forEach((user, index) => {
      response += `${index + 1}. ${user.first_name || user.username}: ${user.msgs_count} сообщений\n`;
    })

    BOT.sendMessage(msg.chat.id, response)
  } catch (error) {
    console.error('Error:', error)
  }
}

module.exports = {
  sendStatsMessage,
}
