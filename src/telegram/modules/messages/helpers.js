const { MESSAGE_TYPE } = require('./constants')
const { User, TotalMessage} = require("../../../../db/models")

const getMessageType = (msg) => {
  if (msg.sticker) return MESSAGE_TYPE.sticker
  if (msg.animation) return MESSAGE_TYPE.animation
  return MESSAGE_TYPE.text
}

const updateStats = async (msg) => {
  try {
    let totalMessage = await TotalMessage.findOne()
    totalMessage.total += 1
    await totalMessage.save()

    let { id: msg_author_tg_id, first_name, last_name} = msg.from
    let msg_type = getMessageType(msg)

    const [user, created] = await User.findOrCreate({
      where: { tg_user_id: msg_author_tg_id },
      defaults: {
        tg_user_id: msg_author_tg_id
      },
    })

    if (msg_type === MESSAGE_TYPE.text) user.msgs_count += 1
    if (msg_type === MESSAGE_TYPE.sticker) user.stickers_count += 1
    if (msg_type === MESSAGE_TYPE.animation) user.animation_count += 1

    user.first_name = last_name ? `${first_name} ${last_name}` : first_name
    await user.save()
  } catch (err) {
    console.error('Error:', err)
  }
}

module.exports = {
  getMessageType,
  updateStats
}
