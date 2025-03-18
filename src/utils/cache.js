/**
 * Cache management module
 */

const { PENDING_WORDS_CACHE_PATH } = require('../config');
const logger = require('./logger');

/**
 * @typedef {Object} CachedNotepad
 * @property {string} name - notepad name
 * @property {Set<string>} words - set of words to add
 */

/**
 * Reads the current cache file
 * @returns {Object.<string, Set<string>>} Map of notepad names to word sets
 */
function readCache() {
  const defaultCache = {};
  
  if (!$file.exists(PENDING_WORDS_CACHE_PATH)) {
    logger.debug(`Cache file doesn't exist: ${PENDING_WORDS_CACHE_PATH}`);
    return defaultCache;
  }
  
  try {
    const data = $file.read(PENDING_WORDS_CACHE_PATH).toUTF8();
    // Cache is stored as {notepadName: [word1, word2, ...]}
    const rawCache = JSON.parse(data);
    
    // Convert arrays to Sets for faster lookups
    const cache = {};
    for (const notepadName in rawCache) {
      cache[notepadName] = new Set(rawCache[notepadName]);
    }
    
    logger.debug(`Loaded cache with ${Object.keys(cache).length} notepads`);
    return cache;
  } catch (e) {
    logger.error(`Failed to read cache: ${e.message}`);
    return defaultCache;
  }
}

/**
 * Writes cache to file
 * @param {Object.<string, Set<string>>} cache Cache object
 */
function writeCache(cache) {
  try {
    // Convert Sets back to arrays for JSON serialization
    const serializedCache = {};
    for (const notepadName in cache) {
      serializedCache[notepadName] = [...cache[notepadName]];
    }
    
    $file.write({
      data: $data.fromUTF8(JSON.stringify(serializedCache)),
      path: PENDING_WORDS_CACHE_PATH
    });
    
    let totalWords = 0;
    Object.values(cache).forEach(wordSet => {
      totalWords += wordSet.size;
    });
    
    logger.debug(`Successfully wrote to cache: ${Object.keys(cache).length} notepads, ${totalWords} total words`);
  } catch (e) {
    logger.error(`Failed to write to cache: ${e.message}`);
  }
}

/**
 * Cache pending words
 * @param {Object} options
 * @param {string[]} options.words - words to add
 * @param {string} options.notepadName - notepad name
 */
function cachePendingWords({ words, notepadName }) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    logger.warn("No words provided to cache");
    return;
  }
  
  if (!notepadName) {
    logger.warn("No notepad name provided for caching words");
    return;
  }
  
  // Read the current cache
  const cache = readCache();
  
  // Initialize notepad in cache if it doesn't exist
  if (!cache[notepadName]) {
    cache[notepadName] = new Set();
  }
  
  // Add new words (automatically handles deduplication via Set)
  let newWordsCount = 0;
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (!cache[notepadName].has(lowerWord)) {
      cache[notepadName].add(lowerWord);
      newWordsCount++;
    }
  });
  
  if (newWordsCount === 0) {
    logger.debug("All words already exist in cache, skipping write");
    return;
  }
  
  logger.debug(`Added ${newWordsCount} new words to cache for notepad "${notepadName}"`);
  
  // Write updated cache
  writeCache(cache);
}

/**
 * Remove words from cache
 * @param {string[]} words - words to remove from cache
 * @param {string} [notepadName] - optional notepad name to target specific notepad
 */
function removePendingWords(words, notepadName) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    logger.warn("No words provided to remove from cache");
    return;
  }
  
  // Convert words to lowercase for case-insensitive matching
  const wordsToRemove = new Set(words.map(word => word.toLowerCase()));
  
  // Read the current cache
  const cache = readCache();
  
  let totalRemoved = 0;
  
  // If notepad is specified, only remove from that notepad
  if (notepadName) {
    if (cache[notepadName]) {
      const beforeCount = cache[notepadName].size;
      wordsToRemove.forEach(word => {
        cache[notepadName].delete(word);
      });
      totalRemoved = beforeCount - cache[notepadName].size;
      
      // Remove notepad entry if empty
      if (cache[notepadName].size === 0) {
        delete cache[notepadName];
      }
    }
  } else {
    // Remove from all notepads
    Object.keys(cache).forEach(padName => {
      const beforeCount = cache[padName].size;
      wordsToRemove.forEach(word => {
        cache[padName].delete(word);
      });
      totalRemoved += (beforeCount - cache[padName].size);
      
      // Remove notepad entry if empty
      if (cache[padName].size === 0) {
        delete cache[padName];
      }
    });
  }
  
  if (totalRemoved > 0) {
    logger.debug(`Removed ${totalRemoved} words from cache`);
    writeCache(cache);
  } else {
    logger.debug("No words were removed from cache");
  }
}

module.exports = {
  cachePendingWords,
  removePendingWords,
};
