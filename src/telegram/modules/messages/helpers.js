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

    if (msg_type === MESSAGE_TYPE.sticker) user.stickers_count += 1
    if (msg_type === MESSAGE_TYPE.animation) {
      user.animation_count += 1
      // console.log(msg)
    }
    user.msgs_count += 1

    user.first_name = last_name ? `${first_name} ${last_name}` : first_name
    await user.save()
  } catch (err) {
    console.error('Error:', err)
  }
}

const getStats = async () => {
  try {
    const totalMessagesCount = await TotalMessage.findOne()
    const totalStickersCount = await User.sum('stickers_count')
    const totalAnimationsCount = await User.sum('animation_count')

    const topUsersByTotalMessages = await User.findAll({
      order: [['msgs_count', 'DESC']],
      limit: 5,
    })

    return {
      totalMessagesCount: totalMessagesCount.total,
      totalStickersCount,
      totalAnimationsCount,
      topUsersByTotalMessages,
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const getUserAvatar = async (bot) => {
  try {
    const userImage = await bot.getUserProfilePhotos(474573662, 1)
    console.log(userImage)
  } catch (err) {
    console.error('Error:', err)
  }
}

module.exports = {
  getMessageType,
  getStats,
  updateStats,
  getUserAvatar
}
