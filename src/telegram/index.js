const { cronObserver } = require('./modules/birthday')
const { messagesCounter, getTotalMessagesCount } = require('./modules/messages')
const { TOTAL_MSG_COUNT } = require('./commands')

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
  console.log({
    text: msg.text,
    'msg.text === TOTAL_MSG_COUNT': msg.text === TOTAL_MSG_COUNT
  })
  if (msg.text === TOTAL_MSG_COUNT) {
    getTotalMessagesCount(bot, msg)
  }

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
