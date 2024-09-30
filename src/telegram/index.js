const { cronObserver } = require('./modules/birthday')
const { sendStatsMessage } = require('./modules/messages')
const { updateStats } = require("./modules/messages/helpers");
const { STATS, START } = require('./commands')

const statsObserver = async (bot, msg) => {
  const message = msg.text
  await updateStats(msg)

  if (message === STATS) {
    await sendStatsMessage(bot, msg)
  }
}

module.exports = {
  cronObserver,
  statsObserver
}
