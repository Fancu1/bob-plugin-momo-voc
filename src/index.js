/**
 * main module
 */

const { createNotepad, addWordsToNotepad, listNotepads } = require('./api/momo');
const { lemmatizeWord } = require('./api/ai');
const { cachePendingWords, removePendingWords} = require('./utils/cache');
const { DEFAULT_NOTEPAD_NAME } = require('./config');
const logger = require('./utils/logger');

/**
 * process add words core logic
 * @param {string[]} words words array
 * @param {string} notepadName notepad name
 * @param {boolean} useLemmatization whether to use AI to lemmatize words
 * @returns {Promise<void>}
 */
async function processAddWords(words, notepadName, useLemmatization = false) {
  let result = "";
  let error = false;
  
  notepadName = notepadName || DEFAULT_NOTEPAD_NAME;
  
  logger.info(`process add words: "${notepadName}": ${words.join(", ")}`);
  
  // Lemmatize words if enabled
  let processedWords = words;
  if (useLemmatization) {
    try {
      logger.debug("Starting word lemmatization...");
      const lemmatizationPromises = words.map(word => lemmatizeWord(word));
      processedWords = await Promise.all(lemmatizationPromises);
      logger.debug(`Lemmatization complete: ${words.join(',')} -> ${processedWords.join(',')}`);
    } catch (err) {
      logger.error(`Lemmatization failed: ${err.message}`);
      // Continue with original words if lemmatization fails
      processedWords = words;
    }
  }
  
  // Cache the words before attempting to add
  cachePendingWords({
    words: processedWords,
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
      
      logger.info(`add words to notepad "${notepadName}": ${processedWords.join(", ")}`);
      result = await addWordsToNotepad(notepadId, processedWords);
    } else {
      logger.info(`notepad "${notepadName}" not exists, create new notepad and add words`);
      result = await createNotepad(processedWords, notepadName);
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
      removePendingWords(processedWords, notepadName);
      logger.debug(`removed completed words from cache`);
    }
  }
}

module.exports = {
  processAddWords,
};
