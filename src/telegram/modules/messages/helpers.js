const axios = require('axios')
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

async function getUserInfo(userId, token) {
  try {
    const userInfoResponse = await axios.get(`https://api.telegram.org/bot${token}/getChat`, {
      params: {
        chat_id: userId,
      },
    })

    const userInfo = userInfoResponse.data

    if (userInfo.ok) {
      const { first_name, last_name, username } = userInfo.result
      return {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || '',
      }
    }

    return null
  } catch (error) {
    console.error("Ошибка получения информации о пользователе:", error.response?.data || error.message)
    return null
  }
}

async function getUserAvatar(BOT, userId, token) {
  try {
    const photos = await BOT.getUserProfilePhotos(userId, {})

    if (photos.total_count > 0) {
      const fileId = photos.photos[0][0].file_id
      const fileResponse = await axios.get(`https://api.telegram.org/bot${token}/getFile`, {
        params: {
          file_id: fileId,
        },
      })

      if (fileResponse.data.ok) {
        const filePath = fileResponse.data.result.file_path
        return `https://api.telegram.org/file/bot${token}/${filePath}`
      }
    }
    const { firstName, lastName } = await getUserInfo(userId, token)

    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&rounded=true&background=random`
  } catch (error) {
    console.error("Ошибка получения аватарки:", error.response?.data || error.message)
    return null
  }
}

const getStats = async (BOT, token) => {
  try {
    const totalMessagesCount = await TotalMessage.findOne()
    const totalStickersCount = await User.sum('stickers_count')
    const totalAnimationsCount = await User.sum('animation_count')

    const topUsersByTotalMessages = await User.findAll({
      order: [['msgs_count', 'DESC']],
      limit: 5,
    })
    const mergeTopUsersByTotalMessages = await Promise.all(
      topUsersByTotalMessages.map(async (user) => {
        const avatar = await getUserAvatar(BOT, user.tg_user_id, token)
        const cleanUser = user.get({ plain: true })
        return {
          ...cleanUser,
          avatar_url: avatar,
        }
      })
    )
    return {
      totalMessagesCount: totalMessagesCount.total,
      totalStickersCount,
      totalAnimationsCount,
      mergeTopUsersByTotalMessages,
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

module.exports = {
  getMessageType,
  getStats,
  updateStats,
  getUserAvatar,
}
