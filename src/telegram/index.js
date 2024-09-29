const { cronObserver } = require('./modules/birthday')
const { sendStatsMessage } = require('./modules/messages')
const { updateStats } = require("./modules/messages/helpers");
const { STATS, START } = require('./commands')
const {isCommandType} = require("./utils");

const getMediaFile = async (bot, fileId) => {
  try {
    const file = await bot.getFile(fileId);
    const filePath = file;
    // console.log(`File Path: https://api.telegram.org/file/bot${token}/${filePath}`);
    console.log(file);
  } catch (error) {
    console.error('Error getting file:', error);
  }
}

const statsObserver = async (bot, msg) => {
  const message = msg.text
  await updateStats(msg)
  // getMediaFile(bot, msg.document.file_id)

  if (message === STATS) {
    await sendStatsMessage(bot, msg)
  }
}

module.exports = {
  cronObserver,
  statsObserver
}
