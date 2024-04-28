const { cronObserver } = require('./modules/birthday')
const { messagesCounter } = require('./modules/messages')

const messagesObserver = (bot, msg) => {
  messagesCounter()
  const {
   text,
   video,
   sticker,
   photo,
   voice
  } = msg
  const chatId = msg.chat.id

  if (text) {
    // Do something if text
  }
  if (sticker) {
    // Do something if sticker
  }
}

module.exports = {
  cronObserver,
  messagesObserver
}
