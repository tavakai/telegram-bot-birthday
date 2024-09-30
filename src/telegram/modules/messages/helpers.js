const axios = require('axios')
const { MESSAGE_TYPE } = require('./constants')
const { User, TotalMessage, Animation, Stickers } = require("../../../../db/models")

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

    let { id: msg_author_tg_id, first_name, last_name } = msg.from
    let msg_type = getMessageType(msg)

    const [user] = await User.findOrCreate({
      where: { tg_user_id: msg_author_tg_id },
      defaults: { tg_user_id: msg_author_tg_id },
    })

    const handleMedia = async (mediaType, model, userField, mediaField, fileId) => {
      const [media] = await model.findOrCreate({
        where: { file_id: fileId },
        defaults: { file_id: fileId }
      })
      user[userField] += 1
      media.send_count += 1
      await media.save()
    }

    if (msg_type === MESSAGE_TYPE.sticker) {
      await handleMedia('sticker', Stickers, 'stickers_count', 'file_id', msg.sticker?.file_id)
    }

    if (msg_type === MESSAGE_TYPE.animation) {
      await handleMedia('animation', Animation, 'animation_count', 'file_id', msg.animation?.file_id)
    }

    user.msgs_count += 1
    user.first_name = last_name ? `${first_name} ${last_name}` : first_name // Обновляем имя пользователя
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

const getMediaFile = async (BOT, fileId, token) => {
  const file = await BOT.getFile(fileId);
  return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
};


const getStats = async (BOT, token) => {
  try {
    // Получаем общие статистики
    const totalMessagesCount = await TotalMessage.findOne()
    const totalStickersCount = await User.sum('stickers_count')
    const totalAnimationsCount = await User.sum('animation_count')

    // Получаем топ пользователей по количеству сообщений
    const topUsersByTotalMessages = await User.findAll({
      order: [['msgs_count', 'DESC']],
      limit: 5,
    })

    // Добавляем аватарки пользователей
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

    // Получаем топ 3 стикера
    const topStickers = await Stickers.findAll({
      order: [['send_count', 'DESC']],
      raw: true,
      limit: 3,
    })

    // Получаем URL стикеров для веб-приложения
    const mergeTopStickers = await Promise.all(
      topStickers.map(async (sticker) => {
        const fileUrl = await getMediaFile(BOT, sticker.file_id, token) // Используем метод для получения URL файла
        return {
          file_id: sticker.file_id,
          send_count: sticker.send_count,
          file_url: fileUrl,
        }
      })
    )

    // Получаем топ 3 анимации
    const topAnimations = await Animation.findAll({
      order: [['send_count', 'DESC']],
      raw: true,
      limit: 3,
    })

    // Получаем URL анимаций для веб-приложения
    const mergeTopAnimations = await Promise.all(
      topAnimations.map(async (animation) => {
        const fileUrl = await getMediaFile(BOT, animation.file_id, token) // Используем метод для получения URL файла
        return {
          file_id: animation.file_id,
          send_count: animation.send_count,
          file_url: fileUrl,
        }
      })
    )

    // Формируем и возвращаем итоговый ответ
    return {
      totalMessagesCount: totalMessagesCount.total,
      totalStickersCount,
      totalAnimationsCount,
      mergeTopUsersByTotalMessages,
      topStickers: mergeTopStickers,
      topAnimations: mergeTopAnimations,
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
