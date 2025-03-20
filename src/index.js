/**
 * main module
 */

const { createNotepad, addWordsToNotepad, listNotepads } = require('./api/momo');
const { lemmatizeWord } = require('./api/ai');
const { cachePendingWords, removePendingWords, getAllCachedWords } = require('./utils/cache');
const { DEFAULT_NOTEPAD_NAME } = require('./config');
const logger = require('./utils/logger');
const { arrayToString, stringToArray } = require('./utils/tools');

/**
 * process add words core logic
 * @param {string|string[]} words - words to add (string or array)
 * @param {string} notepadName - notepad name
 * @param {boolean} useLemmatization - whether to use AI to lemmatize words
 * @returns {Promise<void>}
 */
async function processAddWords(words, notepadName, useLemmatization = false) {
  let result = "";
  let error = false;
  
  // Ensure words is always an array
  const wordsArray = stringToArray(words);
  
  if (wordsArray.length === 0) {
    logger.warn("No valid words to process");
    return;
  }
  
  notepadName = notepadName || DEFAULT_NOTEPAD_NAME;
  
  logger.info(`Processing words for notepad "${notepadName}": ${arrayToString(wordsArray)}`);
  
  // Lemmatize words if enabled
  let processedWords = wordsArray;
  if (useLemmatization) {
    try {
      logger.debug("Starting word lemmatization...");
      const lemmatizationPromises = wordsArray.map(word => lemmatizeWord(word));
      processedWords = await Promise.all(lemmatizationPromises);
      logger.debug(`Lemmatization complete: ${arrayToString(wordsArray)} -> ${arrayToString(processedWords)}`);
    } catch (err) {
      logger.error(`Lemmatization failed: ${err.message}`);
      // Continue with original words if lemmatization fails
      processedWords = wordsArray;
    }
  }
  
  // Cache the words before attempting to add
  cachePendingWords({
    words: processedWords,
    notepadName
  });

  // Get all cached words as an array
  const cachedWords = getAllCachedWords();
  
  if (cachedWords.length === 0) {
    logger.warn("No cached words to process");
    return;
  }

  try {
    logger.debug("Getting notepad list...");
    const notepads = await listNotepads();
    logger.debug(`Retrieved ${notepads.length} notepads`);
    
    const notepad = notepads.find(n => n.name === notepadName);
    
    if (notepad) {
      const notepadId = notepad.id;
      logger.info(`Notepad "${notepadName}" exists with ID: ${notepadId}`);
      
      logger.info(`Adding words to notepad "${notepadName}": ${arrayToString(cachedWords)}`);
      result = await addWordsToNotepad(notepadId, cachedWords);
    } else {
      logger.info(`Notepad "${notepadName}" does not exist, creating new notepad with words`);
      result = await createNotepad(cachedWords, notepadName);
    }
  } catch (err) {
    error = true;
    logger.debug(`Error details: ${JSON.stringify(err.message)}`);
    // TODO: retry
  } finally {
    if (!error) {
      logger.info(`Task completed: ${result}`);
      removePendingWords(cachedWords, notepadName);
      logger.debug("Removed completed words from cache");
    }
  }
}

module.exports = {
  processAddWords,
};
