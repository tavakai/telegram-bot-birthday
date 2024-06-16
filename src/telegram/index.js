const { cronObserver } = require('./modules/birthday')
const { getStats } = require('./modules/messages')
const { updateStats } = require("./modules/messages/helpers");
const { STATS } = require('./commands')

const statsObserver = async (bot, msg) => {
  await updateStats(msg)

  if (msg.text === STATS) {
    getStats(bot, msg)
  }
}

module.exports = {
  cronObserver,
  statsObserver
}
