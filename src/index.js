/**
 * main module
 */

const { createNotepad, addWordsToNotepad, listNotepads } = require('./api/momo');
const { cachePendingWords, removePendingWords} = require('./utils/cache');
const { DEFAULT_NOTEPAD_NAME } = require('./config');
const logger = require('./utils/logger');

/**
 * process add words core logic
 * @param {string[]} words words array
 * @param {string} notepadName notepad name
 * @returns {Promise<void>}
 */
async function processAddWords(words, notepadName) {
  let result = "";
  let error = false;
  
  notepadName = notepadName || DEFAULT_NOTEPAD_NAME;
  
  logger.info(`process add words: "${notepadName}": ${words.join(", ")}`);
  
  // Cache the words before attempting to add
  cachePendingWords({
    words,
    notepadName
  });
  logger.debug(`cached pending words`);

  try {
    logger.debug(`get notepad list...`);
    const notepads = await listNotepads();
    logger.debug(`get ${notepads.length} notepads`);
    
    const notepad = notepads.find(n => n.name === notepadName);
    
    if (notepad) {
      const notepadId = notepad.id;
      logger.info(`notepad "${notepadName}" exists, id: ${notepadId}`);
      
      logger.info(`add words to notepad "${notepadName}": ${words.join(", ")}`);
      result = await addWordsToNotepad(notepadId, words);
    } else {
      logger.info(`notepad "${notepadName}" not exists, create new notepad and add words`);
      result = await createNotepad(words, notepadName);
    }
  } catch (err) {
    error = true;
    logger.error(`add words failed: ${err.message}`);
    logger.debug(`error details: ${JSON.stringify(err)}`);
    // TODO: retry
  } finally {
    if (!error) {
      logger.info(`task completed: ${result}`);
      // remove completed words from cache
      removePendingWords(words, notepadName);
      logger.debug(`removed completed words from cache`);
    }
  }
}

/**
 * clear log file
 */
function clearDebugLogs() {
  logger.clearLogFile();
  return "log file cleared";
}

/**
 * get log file path
 * @returns {string} log file path
 */
function getDebugLogPath() {
  return logger.getLogFilePath();
}

module.exports = {
  processAddWords,
  clearDebugLogs,
  getDebugLogPath
};
