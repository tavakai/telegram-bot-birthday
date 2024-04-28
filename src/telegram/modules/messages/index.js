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

module.exports = {
  messagesCounter,
}
