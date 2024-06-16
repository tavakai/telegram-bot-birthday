const { TotalMessage, User } = require("../../../../db/models")

const getStats = async (BOT, msg) => {
  try {
    const totalMessagesCount = await TotalMessage.findOne()
    const totalStickersCount = await User.sum('stickers_count')
    const totalAnimationsCount = await User.sum('animation_count')

    const topUsers = await User.findAll({
      order: [['msgs_count', 'DESC']],
      limit: 3,
    })

    let response = `Общая статистика:\n`
    response += `Cообщений: ${totalMessagesCount.total}\n`
    response += `Стикеры: ${totalStickersCount}\n`
    response += `Анимации: ${totalAnimationsCount}\n\n`
    response += `Топ-3 участников по количеству сообщений:\n`

    topUsers.forEach((user, index) => {
      response += `${index + 1}. ${user.first_name || user.username}: ${user.msgs_count} сообщений\n`;
    })

    BOT.sendMessage(msg.chat.id, response)
  } catch (error) {
    console.error('Error:', error)
  }
}

module.exports = {
  getStats,
}
