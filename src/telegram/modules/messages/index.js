const { TotalMessage } = require("../../../../db/models")

const messagesCounter = async () => {
  try {
    let totalMessage = await TotalMessage.findOne()
    if (!totalMessage) {
      await TotalMessage.create({ total: 1 })
    } else {
      await TotalMessage.update({ total: totalMessage.total + 1 }, { where: { id: totalMessage.id } })
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const getTotalMessagesCount = async (BOT, msg) => {
  try {
    let totalMessagesCount = await TotalMessage.findOne()
    BOT.sendMessage(msg.chat.id, `Отправлено сообщений - ${totalMessagesCount.total}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

module.exports = {
  messagesCounter,
  getTotalMessagesCount,
}
